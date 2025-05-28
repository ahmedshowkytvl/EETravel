import { useState } from 'react';
import { Trash2, Calendar, Users, Plane, Hotel, Car, MapPin, Package, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';

interface CartItemProps {
  item: any;
}

const getItemIcon = (itemType: string) => {
  switch (itemType) {
    case 'flight': return <Plane className="h-5 w-5" />;
    case 'hotel': case 'room': return <Hotel className="h-5 w-5" />;
    case 'transportation': return <Car className="h-5 w-5" />;
    case 'tour': return <MapPin className="h-5 w-5" />;
    case 'package': return <Package className="h-5 w-5" />;
    case 'visa': return <FileText className="h-5 w-5" />;
    default: return <Package className="h-5 w-5" />;
  }
};

const getItemTypeLabel = (itemType: string) => {
  switch (itemType) {
    case 'flight': return 'Flight';
    case 'hotel': return 'Hotel';
    case 'room': return 'Room';
    case 'transportation': return 'Transportation';
    case 'tour': return 'Tour';
    case 'package': return 'Package';
    case 'visa': return 'Visa';
    default: return 'Item';
  }
};

export function CartItem({ item }: CartItemProps) {
  const { updateCartItem, removeFromCart, isUpdating, isRemoving } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [notes, setNotes] = useState(item.notes || '');

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity !== item.quantity) {
      setQuantity(newQuantity);
      updateCartItem(item.id, { quantity: newQuantity });
    }
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    updateCartItem(item.id, { notes: newNotes });
  };

  const currentPrice = item.discountedPriceAtAdd || item.priceAtAdd;
  const totalPrice = currentPrice * item.quantity;

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg">
              {getItemIcon(item.itemType)}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{getItemTypeLabel(item.itemType)}</Badge>
                <h3 className="font-semibold text-lg">{item.itemName || `${getItemTypeLabel(item.itemType)} #${item.itemId}`}</h3>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                {(item.checkInDate || item.checkOutDate) && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {item.checkInDate && new Date(item.checkInDate).toLocaleDateString()} 
                      {item.checkOutDate && ` - ${new Date(item.checkOutDate).toLocaleDateString()}`}
                    </span>
                  </div>
                )}
                
                {item.travelDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Travel: {new Date(item.travelDate).toLocaleDateString()}</span>
                  </div>
                )}

                {(item.adults > 0 || item.children > 0 || item.infants > 0) && (
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {item.adults > 0 && `${item.adults} Adult${item.adults > 1 ? 's' : ''}`}
                      {item.children > 0 && `, ${item.children} Child${item.children > 1 ? 'ren' : ''}`}
                      {item.infants > 0 && `, ${item.infants} Infant${item.infants > 1 ? 's' : ''}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Quantity and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                  <Input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    className="w-20"
                    disabled={isUpdating}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`notes-${item.id}`}>Special Requests</Label>
                  <Textarea
                    id={`notes-${item.id}`}
                    placeholder="Any special requests or notes..."
                    value={notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    className="min-h-[60px]"
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-right space-y-2 ml-4">
            <div className="space-y-1">
              {item.discountedPriceAtAdd && item.discountedPriceAtAdd < item.priceAtAdd && (
                <div className="text-sm text-muted-foreground line-through">
                  ${(item.priceAtAdd / 100).toFixed(2)}
                </div>
              )}
              <div className="text-lg font-semibold">
                ${(currentPrice / 100).toFixed(2)}
              </div>
              {item.quantity > 1 && (
                <div className="text-sm text-muted-foreground">
                  Total: ${(totalPrice / 100).toFixed(2)}
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeFromCart(item.id)}
              disabled={isRemoving}
              className="text-destructive hover:text-destructive"
            >
              {isRemoving ? (
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}