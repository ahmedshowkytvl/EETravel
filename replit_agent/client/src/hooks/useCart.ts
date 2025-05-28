import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface CartItemData {
  id?: number;
  itemType: 'flight' | 'hotel' | 'room' | 'tour' | 'package' | 'visa' | 'transportation';
  itemId: number;
  itemName?: string;
  quantity: number;
  adults: number;
  children: number;
  infants: number;
  checkInDate?: string;
  checkOutDate?: string;
  travelDate?: string;
  configuration?: any;
  priceAtAdd: number;
  discountedPriceAtAdd?: number;
  notes?: string;
}

export function useCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string>('');

  // Generate session ID for guest users
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
    }
  }, [sessionId]);

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['/api/cart', sessionId],
    enabled: !!sessionId,
  });

  // Add item to cart
  const addToCartMutation = useMutation({
    mutationFn: async (item: CartItemData) => {
      return apiRequest('POST', '/api/cart', {
        ...item,
        sessionId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  // Update cart item
  const updateCartMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<CartItemData> }) => {
      return apiRequest('PATCH', `/api/cart/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update cart item",
        variant: "destructive",
      });
    },
  });

  // Remove item from cart
  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Removed from Cart",
        description: "Item has been removed from your cart",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart",
        variant: "destructive",
      });
    },
  });

  // Clear cart
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('DELETE', '/api/cart/clear', { sessionId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart",
      });
    },
  });

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total: number, item: any) => {
      const price = item.discountedPriceAtAdd || item.priceAtAdd;
      return total + (price * item.quantity);
    }, 0);

    const tax = Math.round(subtotal * 0.1); // 10% tax
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const addToCart = (item: CartItemData) => addToCartMutation.mutate(item);
  const updateCartItem = (id: number, updates: Partial<CartItemData>) => 
    updateCartMutation.mutate({ id, updates });
  const removeFromCart = (id: number) => removeFromCartMutation.mutate(id);
  const clearCart = () => clearCartMutation.mutate();

  return {
    cartItems,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    calculateTotals,
    sessionId,
    isAdding: addToCartMutation.isPending,
    isUpdating: updateCartMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
}