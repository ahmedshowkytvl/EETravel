import { ShoppingCart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { Link } from 'wouter';

interface CartButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export function CartButton({ className, variant = 'outline', size = 'default' }: CartButtonProps) {
  const { cartItems } = useCart();
  
  const itemCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  return (
    <Link href="/cart">
      <Button variant={variant} size={size} className={`relative ${className}`}>
        <ShoppingCart className="h-4 w-4" />
        <span className="hidden sm:inline ml-2">Cart</span>
        {itemCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
}

interface AddToCartButtonProps {
  item: {
    itemType: 'flight' | 'hotel' | 'room' | 'tour' | 'package' | 'visa' | 'transportation';
    itemId: number;
    itemName: string;
    price: number;
    discountedPrice?: number;
  };
  quantity?: number;
  adults?: number;
  children?: number;
  infants?: number;
  checkInDate?: string;
  checkOutDate?: string;
  travelDate?: string;
  configuration?: any;
  notes?: string;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function AddToCartButton({ 
  item, 
  quantity = 1,
  adults = 1,
  children = 0,
  infants = 0,
  checkInDate,
  checkOutDate,
  travelDate,
  configuration,
  notes,
  className,
  disabled = false,
  children
}: AddToCartButtonProps) {
  const { addToCart, isAdding } = useCart();

  const handleAddToCart = () => {
    addToCart({
      itemType: item.itemType,
      itemId: item.itemId,
      itemName: item.itemName,
      quantity,
      adults,
      children,
      infants,
      checkInDate,
      checkOutDate,
      travelDate,
      configuration,
      priceAtAdd: item.price,
      discountedPriceAtAdd: item.discountedPrice,
      notes,
    });
  };

  return (
    <Button 
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className={className}
    >
      {isAdding ? (
        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
      ) : (
        <>
          <Plus className="h-4 w-4 mr-2" />
          {children || 'Add to Cart'}
        </>
      )}
    </Button>
  );
}