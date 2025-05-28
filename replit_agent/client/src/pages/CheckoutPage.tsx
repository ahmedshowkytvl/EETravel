import { useState } from 'react';
import { CreditCard, Lock, ShoppingCart, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Link, useLocation } from 'wouter';

const CheckoutForm = () => {
  const { toast } = useToast();
  const { cartItems, calculateTotals, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  const { total } = calculateTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and email address",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order in our system
      const orderResponse = await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          specialRequests: customerInfo.specialRequests,
          totalAmount: total,
          paymentMethod: paymentMethod,
          paymentStatus: paymentMethod === 'cash' ? 'pending' : 'completed',
          items: Array.isArray(cartItems) ? cartItems.map((item: any) => ({
            itemType: item.itemType,
            itemId: item.itemId,
            itemName: item.itemName,
            quantity: item.quantity,
            adults: item.adults,
            children: item.children,
            infants: item.infants,
            checkInDate: item.checkInDate,
            checkOutDate: item.checkOutDate,
            travelDate: item.travelDate,
            configuration: item.configuration,
            priceAtAdd: item.priceAtAdd,
            discountedPriceAtAdd: item.discountedPriceAtAdd,
            notes: item.notes,
          })) : []
        })
      });

      // Clear cart on successful order creation
      clearCart();
      
      toast({
        title: "Order Created Successfully",
        description: "Your booking request has been submitted!",
      });

      // Redirect to order confirmation page
      setLocation(`/order-confirmation?order=${orderResponse.orderNumber}`);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <Label htmlFor="special-requests">Special Requests</Label>
            <Textarea
              id="special-requests"
              value={customerInfo.specialRequests}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, specialRequests: e.target.value }))}
              placeholder="Any special requests or requirements for your trip..."
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash">Pay on Arrival (Cash)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank_transfer" id="bank_transfer" />
              <Label htmlFor="bank_transfer">Bank Transfer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <Label htmlFor="credit_card">Credit Card (Call to arrange)</Label>
            </div>
          </RadioGroup>
          
          {paymentMethod === 'bank_transfer' && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Bank Transfer Details:</p>
              <p className="text-sm text-muted-foreground">
                Bank details will be provided after order confirmation.
                Please complete the transfer within 24 hours to secure your booking.
              </p>
            </div>
          )}
          
          {paymentMethod === 'credit_card' && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Credit Card Payment:</p>
              <p className="text-sm text-muted-foreground">
                Our team will contact you to arrange secure credit card payment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-4">
        <Link href="/cart">
          <Button variant="outline" type="button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
        </Link>
        
        <Button 
          type="submit" 
          disabled={isProcessing}
          size="lg"
          className="min-w-[200px]"
        >
          {isProcessing ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          {isProcessing ? 'Processing...' : `Complete Order - $${(total / 100).toFixed(2)}`}
        </Button>
      </div>

      {/* Security Notice */}
      <div className="text-center text-sm text-muted-foreground border-t pt-4">
        <Lock className="h-4 w-4 inline mr-1" />
        Your booking information is secure and protected
      </div>
    </form>
  );
};

export default function CheckoutPage() {
  const { cartItems, isLoading, calculateTotals } = useCart();
  const { subtotal, tax, total } = calculateTotals();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingCart className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Link href="/">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <div className="font-medium">{item.itemName || `${item.itemType} #${item.itemId}`}</div>
                      <div className="text-muted-foreground">
                        Qty: {item.quantity}
                        {(item.adults > 0 || item.children > 0) && (
                          <span className="ml-2">
                            • {item.adults} Adult{item.adults > 1 ? 's' : ''}
                            {item.children > 0 && `, ${item.children} Child${item.children > 1 ? 'ren' : ''}`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      ${((item.discountedPriceAtAdd || item.priceAtAdd) * item.quantity / 100).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Fees</span>
                  <span>${(tax / 100).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${(total / 100).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}