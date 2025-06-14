<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'booking_id' => 'required|exists:bookings,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|string|in:stripe,paypal,bank_transfer,cash',
            'payment_gateway_id' => 'nullable|string',
            'payment_details' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $booking = Booking::where('id', $request->booking_id)
                         ->where('user_id', $request->user()->id)
                         ->first();

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found or unauthorized'
            ], 404);
        }

        if ($booking->status === 'cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot make payment for cancelled booking'
            ], 400);
        }

        $remainingAmount = $booking->total_amount - $booking->paid_amount;
        
        if ($request->amount > $remainingAmount) {
            return response()->json([
                'success' => false,
                'message' => 'Payment amount exceeds remaining balance'
            ], 400);
        }

        DB::beginTransaction();

        try {
            $payment = Payment::create([
                'booking_id' => $booking->id,
                'user_id' => $request->user()->id,
                'amount' => $request->amount,
                'payment_method' => $request->payment_method,
                'payment_gateway_id' => $request->payment_gateway_id,
                'payment_details' => $request->payment_details,
                'status' => 'pending',
                'transaction_id' => 'TXN_' . strtoupper(uniqid()),
            ]);

            // Update booking paid amount and payment status
            $newPaidAmount = $booking->paid_amount + $request->amount;
            $paymentStatus = $newPaidAmount >= $booking->total_amount ? 'paid' : 'partial';

            $booking->update([
                'paid_amount' => $newPaidAmount,
                'payment_status' => $paymentStatus,
                'payment_method' => $request->payment_method,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment processed successfully',
                'data' => [
                    'payment' => $payment,
                    'booking' => $booking->fresh()
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Payment processing failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function bookingPayments($bookingId)
    {
        $booking = Booking::where('id', $bookingId)
                         ->where('user_id', auth()->id())
                         ->first();

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found or unauthorized'
            ], 404);
        }

        $payments = Payment::where('booking_id', $bookingId)
                          ->orderBy('created_at', 'desc')
                          ->get();

        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }

    public function verify(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'transaction_id' => 'required|string',
            'payment_gateway_response' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $payment = Payment::where('transaction_id', $request->transaction_id)->first();

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found'
            ], 404);
        }

        // Verify with payment gateway
        $isVerified = $this->verifyWithGateway($payment, $request->payment_gateway_response);

        if ($isVerified) {
            $payment->update([
                'status' => 'completed',
                'verified_at' => now(),
                'gateway_response' => $request->payment_gateway_response,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment verified successfully',
                'data' => $payment->fresh()
            ]);
        } else {
            $payment->update([
                'status' => 'failed',
                'gateway_response' => $request->payment_gateway_response,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed'
            ], 400);
        }
    }

    public function stripeWebhook(Request $request)
    {
        // Handle Stripe webhook events
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');

        try {
            // Verify webhook signature and process event
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $signature,
                config('services.stripe.webhook_secret')
            );

            switch ($event['type']) {
                case 'payment_intent.succeeded':
                    $this->handleStripePaymentSuccess($event['data']['object']);
                    break;
                case 'payment_intent.payment_failed':
                    $this->handleStripePaymentFailure($event['data']['object']);
                    break;
            }

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function paypalWebhook(Request $request)
    {
        // Handle PayPal webhook events
        $payload = $request->all();

        try {
            // Verify webhook and process event
            switch ($payload['event_type']) {
                case 'PAYMENT.CAPTURE.COMPLETED':
                    $this->handlePaypalPaymentSuccess($payload);
                    break;
                case 'PAYMENT.CAPTURE.DENIED':
                    $this->handlePaypalPaymentFailure($payload);
                    break;
            }

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    private function verifyWithGateway($payment, $gatewayResponse)
    {
        // Implementation depends on the payment gateway
        // This is a simplified verification
        return isset($gatewayResponse['status']) && $gatewayResponse['status'] === 'success';
    }

    private function handleStripePaymentSuccess($paymentIntent)
    {
        $payment = Payment::where('payment_gateway_id', $paymentIntent['id'])->first();
        if ($payment) {
            $payment->update(['status' => 'completed', 'verified_at' => now()]);
        }
    }

    private function handleStripePaymentFailure($paymentIntent)
    {
        $payment = Payment::where('payment_gateway_id', $paymentIntent['id'])->first();
        if ($payment) {
            $payment->update(['status' => 'failed']);
        }
    }

    private function handlePaypalPaymentSuccess($payload)
    {
        $payment = Payment::where('payment_gateway_id', $payload['resource']['id'])->first();
        if ($payment) {
            $payment->update(['status' => 'completed', 'verified_at' => now()]);
        }
    }

    private function handlePaypalPaymentFailure($payload)
    {
        $payment = Payment::where('payment_gateway_id', $payload['resource']['id'])->first();
        if ($payment) {
            $payment->update(['status' => 'failed']);
        }
    }
}