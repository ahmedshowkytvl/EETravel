import { useEffect, useState } from 'react';
import { CheckCircle, Download, Mail, Phone, MapPin, Calendar, Users, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';

export default function OrderConfirmationPage() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const orderNumber = urlParams.get('order');

  const { data: order, isLoading } = useQuery({
    queryKey: ['/api/orders', orderNumber],
    enabled: !!orderNumber,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!orderNumber || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find the order you're looking for.
          </p>
          <Link href="/">
            <Button size="lg">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your booking. Your order number is <strong>#{order.orderNumber}</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Order Number:</span>
                  <span className="font-medium">#{order.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Order Status:</span>
                  <Badge className={getOrderStatusColor(order.status)}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Payment Status:</span>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Payment Method:</span>
                  <span className="font-medium capitalize">{order.paymentMethod?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Order Date:</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customerName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customerEmail}</span>
                </div>
                {order.customerPhone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{order.customerPhone}</span>
                  </div>
                )}
                {order.specialRequests && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Special Requests:</h4>
                    <p className="text-muted-foreground">{order.specialRequests}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booked Items */}
            <Card>
              <CardHeader>
                <CardTitle>Booked Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{item.itemName || `${item.itemType} #${item.itemId}`}</h4>
                        <span className="font-medium">
                          ${((item.discountedPriceAtAdd || item.priceAtAdd) * item.quantity / 100).toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center space-x-4">
                          <span>Quantity: {item.quantity}</span>
                          {(item.adults > 0 || item.children > 0) && (
                            <span>
                              {item.adults} Adult{item.adults > 1 ? 's' : ''}
                              {item.children > 0 && `, ${item.children} Child${item.children > 1 ? 'ren' : ''}`}
                              {item.infants > 0 && `, ${item.infants} Infant${item.infants > 1 ? 's' : ''}`}
                            </span>
                          )}
                        </div>
                        
                        {(item.checkInDate || item.checkOutDate) && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {item.checkInDate && `Check-in: ${new Date(item.checkInDate).toLocaleDateString()}`}
                              {item.checkInDate && item.checkOutDate && ' • '}
                              {item.checkOutDate && `Check-out: ${new Date(item.checkOutDate).toLocaleDateString()}`}
                            </span>
                          </div>
                        )}
                        
                        {item.travelDate && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3" />
                            <span>Travel Date: {new Date(item.travelDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {item.notes && (
                          <div className="mt-2">
                            <span className="font-medium">Notes: </span>
                            <span>{item.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Total Amount */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${((order.totalAmount || 0) / 1.1 / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span>${((order.totalAmount || 0) * 0.1 / 100).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${((order.totalAmount || 0) / 100).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Confirmation
                  </Button>
                  
                  {order.paymentStatus === 'pending' && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Payment Required:</strong> Please complete your payment to confirm your booking.
                        {order.paymentMethod === 'bank_transfer' && ' Bank details will be sent to your email.'}
                        {order.paymentMethod === 'credit_card' && ' Our team will contact you shortly.'}
                      </p>
                    </div>
                  )}
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      A confirmation email has been sent to <strong>{order.customerEmail}</strong>
                    </p>
                  </div>
                  
                  <Link href="/">
                    <Button className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}