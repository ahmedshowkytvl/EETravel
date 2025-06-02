import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Search, Hotel, Users, Calendar, Plus, Minus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery } from "@tanstack/react-query";

interface Hotel {
  id: number;
  name: string;
  description?: string;
  destinationId?: number;
  imageUrl?: string;
  rating?: number;
  amenities?: string[];
  status: string;
}

interface Room {
  id: number;
  name: string;
  description?: string;
  hotelId: number;
  type: string;
  maxOccupancy: number;
  maxAdults: number;
  maxChildren: number;
  maxInfants: number;
  price: number;
  discountedPrice?: number;
  imageUrl?: string;
  size?: string;
  bedType?: string;
  amenities?: string[];
  view?: string;
  available: boolean;
  status: string;
}

interface SelectedRoom {
  hotelId: number;
  hotelName: string;
  roomId: number;
  roomName: string;
  adults: number;
  children: number;
  infants: number;
  nights: number;
  totalPrice: number;
}

interface Props {
  onSelectionChange: (selectedRooms: SelectedRoom[]) => void;
  initialSelection?: SelectedRoom[];
  guestBreakdown?: {
    adults: number;
    children: number;
    infants: number;
  };
  nights?: number;
  onGuestBreakdownChange?: (guestBreakdown: { adults: number; children: number; infants: number }) => void;
}

const HotelSearchComponent: React.FC<Props> = ({ 
  onSelectionChange, 
  initialSelection = [], 
  guestBreakdown: propGuestBreakdown,
  nights: propNights,
  onGuestBreakdownChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHotels, setSelectedHotels] = useState<number[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>(initialSelection);
  const [guestBreakdown, setGuestBreakdown] = useState(() => ({
    adults: propGuestBreakdown?.adults ?? 2,
    children: propGuestBreakdown?.children ?? 0,
    infants: propGuestBreakdown?.infants ?? 0
  }));
  const [nights, setNights] = useState(propNights || 3);

  // Fetch hotels
  const { data: hotels = [], isLoading: hotelsLoading } = useQuery<Hotel[]>({
    queryKey: ['/api/hotels'],
  });

  // Fetch rooms
  const { data: rooms = [], isLoading: roomsLoading } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });

  // Update internal state when props change and recalculate room allocations
  useEffect(() => {
    if (propGuestBreakdown) {
      setGuestBreakdown(propGuestBreakdown);
      
      // Update existing room selections with new guest breakdown
      setSelectedRooms(prevRooms => {
        const updatedRooms = prevRooms.map(selectedRoom => {
          const room = rooms.find(r => r.id === selectedRoom.roomId);
          if (room) {
            return {
              ...selectedRoom,
              adults: Math.min(propGuestBreakdown.adults, room.maxAdults),
              children: Math.min(propGuestBreakdown.children, room.maxChildren),
              infants: Math.min(propGuestBreakdown.infants, room.maxInfants),
              totalPrice: (room.discountedPrice || room.price) * nights
            };
          }
          return selectedRoom;
        });
        
        // Only notify parent if there are actual changes to prevent infinite loops
        if (JSON.stringify(updatedRooms) !== JSON.stringify(prevRooms)) {
          setTimeout(() => onSelectionChange?.(updatedRooms), 0);
        }
        return updatedRooms;
      });
    }
  }, [propGuestBreakdown?.adults, propGuestBreakdown?.children, propGuestBreakdown?.infants, rooms.length, nights]);

  useEffect(() => {
    if (propNights && propNights !== nights) {
      setNights(propNights);
      
      // Update existing room selections with new nights count
      setSelectedRooms(prevRooms => {
        const updatedRooms = prevRooms.map(selectedRoom => {
          const room = rooms.find(r => r.id === selectedRoom.roomId);
          if (room) {
            return {
              ...selectedRoom,
              nights: propNights,
              totalPrice: (room.discountedPrice || room.price) * propNights
            };
          }
          return selectedRoom;
        });
        
        // Only notify parent if there are actual changes
        if (JSON.stringify(updatedRooms) !== JSON.stringify(prevRooms)) {
          setTimeout(() => onSelectionChange?.(updatedRooms), 0);
        }
        return updatedRooms;
      });
    }
  }, [propNights, rooms.length, nights]);

  // Memoized hotel filtering to prevent recalculation on every render
  const filteredHotels = useMemo(() => 
    hotels.filter((hotel: any) => 
      hotel.status === 'active' && (searchTerm === '' || hotel.name.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [hotels, searchTerm]
  );

  // Memoized room filtering for selected hotels
  const availableRooms = useMemo(() => 
    rooms.filter(room => 
      selectedHotels.includes(room.hotelId) && 
      room.available && 
      room.status === 'active'
    ), [rooms, selectedHotels]
  );

  // Handle hotel selection with batched state updates
  const handleHotelSelect = (hotelId: number) => {
    const isCurrentlySelected = selectedHotels.includes(hotelId);
    
    if (isCurrentlySelected) {
      // Remove hotel and its rooms from selection
      const newSelectedHotels = selectedHotels.filter(id => id !== hotelId);
      const newSelectedRooms = selectedRooms.filter(room => room.hotelId !== hotelId);
      
      setSelectedHotels(newSelectedHotels);
      setSelectedRooms(newSelectedRooms);
      
      // Notify parent of the updated selection
      setTimeout(() => onSelectionChange(newSelectedRooms), 0);
    } else {
      // Add hotel to selection
      const newSelectedHotels = [...selectedHotels, hotelId];
      setSelectedHotels(newSelectedHotels);
      
      // Notify parent - no room changes when just selecting hotel
      setTimeout(() => onSelectionChange(selectedRooms), 0);
    }
  };

  // Handle room selection
  const handleRoomSelect = (room: Room, isSelected: boolean) => {
    const hotel = hotels.find(h => h.id === room.hotelId);
    if (!hotel) return;

    if (isSelected) {
      // Add room to selection
      const newRoom: SelectedRoom = {
        hotelId: room.hotelId,
        hotelName: hotel.name,
        roomId: room.id,
        roomName: room.name,
        adults: Math.min(guestBreakdown.adults, room.maxAdults),
        children: Math.min(guestBreakdown.children, room.maxChildren),
        infants: Math.min(guestBreakdown.infants, room.maxInfants),
        nights: nights,
        totalPrice: (room.discountedPrice || room.price) * nights
      };
      setSelectedRooms(prev => [...prev, newRoom]);
    } else {
      // Remove room from selection
      setSelectedRooms(prev => prev.filter(r => r.roomId !== room.id));
    }
  };

  // Update guest count for a specific room
  const updateRoomGuests = (roomId: number, guestType: 'adults' | 'children' | 'infants', count: number) => {
    setSelectedRooms(prev => prev.map(room => {
      if (room.roomId === roomId) {
        const updatedRoom = { ...room, [guestType]: count };
        // Recalculate total price
        updatedRoom.totalPrice = rooms.find(r => r.id === roomId)?.price || 0 * room.nights;
        return updatedRoom;
      }
      return room;
    }));
  };

  // Handle parent notification manually in handlers to avoid useEffect loops

  const isRoomSelected = (roomId: number) => {
    return selectedRooms.some(r => r.roomId === roomId);
  };

  if (hotelsLoading || roomsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading hotels and rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hotel className="h-5 w-5" />
            Hotel Search & Room Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hotel Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search hotels by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Guest Breakdown */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Adults (12+ years)</label>
              <div className="flex items-center gap-2 mt-1">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setGuestBreakdown(prev => {
                      const newBreakdown = { ...prev, adults: Math.max(1, prev.adults - 1) };
                      if (onGuestBreakdownChange) {
                        setTimeout(() => onGuestBreakdownChange(newBreakdown), 0);
                      }
                      return newBreakdown;
                    });
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{guestBreakdown.adults}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setGuestBreakdown(prev => {
                      const newBreakdown = { ...prev, adults: prev.adults + 1 };
                      if (onGuestBreakdownChange) {
                        setTimeout(() => onGuestBreakdownChange(newBreakdown), 0);
                      }
                      return newBreakdown;
                    });
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Children (2-11 years)</label>
              <div className="flex items-center gap-2 mt-1">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setGuestBreakdown(prev => {
                      const newBreakdown = { ...prev, children: Math.max(0, prev.children - 1) };
                      // Notify parent component if callback exists
                      if (onGuestBreakdownChange) {
                        setTimeout(() => onGuestBreakdownChange(newBreakdown), 0);
                      }
                      return newBreakdown;
                    });
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{guestBreakdown.children}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setGuestBreakdown(prev => {
                      const newBreakdown = { ...prev, children: prev.children + 1 };
                      // Notify parent component if callback exists
                      if (onGuestBreakdownChange) {
                        setTimeout(() => onGuestBreakdownChange(newBreakdown), 0);
                      }
                      return newBreakdown;
                    });
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Infants (0-23 months)</label>
              <div className="flex items-center gap-2 mt-1">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setGuestBreakdown(prev => {
                      const newBreakdown = { ...prev, infants: Math.max(0, prev.infants - 1) };
                      if (onGuestBreakdownChange) {
                        setTimeout(() => onGuestBreakdownChange(newBreakdown), 0);
                      }
                      return newBreakdown;
                    });
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{guestBreakdown.infants}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setGuestBreakdown(prev => {
                      const newBreakdown = { ...prev, infants: prev.infants + 1 };
                      if (onGuestBreakdownChange) {
                        setTimeout(() => onGuestBreakdownChange(newBreakdown), 0);
                      }
                      return newBreakdown;
                    });
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Nights */}
          <div>
            <label className="text-sm font-medium">Number of Nights</label>
            <div className="flex items-center gap-2 mt-1">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setNights(Math.max(1, nights - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{nights}</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setNights(nights + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotel Results */}
      <Card>
        <CardHeader>
          <CardTitle>
            {searchTerm ? `Search Results (${filteredHotels.length} hotels found)` : `Available Hotels (${filteredHotels.length} hotels)`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredHotels.map(hotel => (
              <div 
                key={hotel.id}
                className={`border rounded-lg p-4 transition-colors ${
                  selectedHotels.includes(hotel.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={selectedHotels.includes(hotel.id)}
                    onCheckedChange={() => handleHotelSelect(hotel.id)}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{hotel.name}</h3>
                    {hotel.description && (
                      <p className="text-sm text-gray-600 mt-1">{hotel.description}</p>
                    )}
                    {hotel.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm">{hotel.rating}/5</span>
                      </div>
                    )}
                  </div>
                  {selectedHotels.includes(hotel.id) && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Rooms - Grouped by Hotel */}
      {availableRooms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {selectedHotels.map(hotelId => {
                const hotel = hotels.find(h => h.id === hotelId);
                const hotelRooms = availableRooms.filter(room => 
                  room.hotelId === hotelId && 
                  room.maxAdults >= guestBreakdown.adults &&
                  room.maxChildren >= guestBreakdown.children &&
                  room.maxInfants >= guestBreakdown.infants
                );
                
                if (hotelRooms.length === 0) {
                  return (
                    <div key={hotelId} className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                      <h3 className="font-semibold text-lg mb-2 text-yellow-800">{hotel?.name}</h3>
                      <p className="text-yellow-700 text-sm">
                        No rooms available that can accommodate {guestBreakdown.adults} adults, {guestBreakdown.children} children, and {guestBreakdown.infants} infants.
                      </p>
                    </div>
                  );
                }
                
                return (
                  <div key={hotelId} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-4 text-blue-700">{hotel?.name}</h3>
                    <div className="grid gap-3">
                      {hotelRooms.map(room => {
                        const isSelected = isRoomSelected(room.id);
                        
                        return (
                          <div key={room.id} className="border rounded-md p-3 bg-gray-50">
                            <div className="flex items-start gap-3">
                              <Checkbox 
                                checked={isSelected}
                                onCheckedChange={(checked) => handleRoomSelect(room, checked as boolean)}
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{room.name}</h4>
                                    {room.description && (
                                      <p className="text-sm text-gray-500 mt-1">{room.description}</p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-lg">
                                      ${room.discountedPrice || room.price}/night
                                    </div>
                                    {room.discountedPrice && room.discountedPrice < room.price && (
                                      <div className="text-sm text-gray-500 line-through">
                                        ${room.price}
                                      </div>
                                    )}
                                  </div>
                                </div>
                        
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="outline">{room.type}</Badge>
                                  <Badge variant="outline">{room.maxAdults} Adults</Badge>
                                  <Badge variant="outline">{room.maxChildren} Children</Badge>
                                  {room.bedType && <Badge variant="outline">{room.bedType}</Badge>}
                                  {room.size && <Badge variant="outline">{room.size}</Badge>}
                                </div>

                                {/* Guest allocation for selected rooms */}
                                {isSelected && (
                                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <h5 className="font-medium mb-2">Guest Allocation</h5>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                      <div>
                                        <span>Adults: </span>
                                        <span className="font-medium">
                                          {selectedRooms.find(r => r.roomId === room.id)?.adults || 0}
                                        </span>
                                      </div>
                                      <div>
                                        <span>Children: </span>
                                        <span className="font-medium">
                                          {selectedRooms.find(r => r.roomId === room.id)?.children || 0}
                                        </span>
                                      </div>
                                      <div>
                                        <span>Infants: </span>
                                        <span className="font-medium">
                                          {selectedRooms.find(r => r.roomId === room.id)?.infants || 0}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t">
                                      <span className="font-medium">
                                        Total: ${selectedRooms.find(r => r.roomId === room.id)?.totalPrice || 0}
                                        ({nights} nights)
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Rooms Summary */}
      {selectedRooms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Rooms ({selectedRooms.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedRooms.map(room => (
                <div key={room.roomId} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">{room.roomName}</div>
                    <div className="text-sm text-gray-600">{room.hotelName}</div>
                    <div className="text-sm">
                      {room.adults} Adults, {room.children} Children, {room.infants} Infants
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${room.totalPrice}</div>
                    <div className="text-sm text-gray-600">{room.nights} nights</div>
                  </div>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total Accommodation Cost:</span>
                  <span>${selectedRooms.reduce((sum, room) => sum + room.totalPrice, 0)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HotelSearchComponent;