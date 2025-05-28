import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Car as CarIcon, 
  Bus as BusIcon, 
  Train as TrainIcon, 
  Ship as BoatIcon,
  MapPin as MapPinIcon, 
  Calendar as CalendarIcon, 
  Clock as ClockIcon,
  Users as UsersIcon,
  Fuel as FuelIcon,
  AirVent as AirVentIcon,
  Wifi as WifiIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Info as InfoIcon
} from 'lucide-react';

const TransportationSearchResults: React.FC = () => {
  // Mock transportation data - in a real app this would come from API
  const cars = [
    {
      id: 1,
      type: 'Economy',
      name: 'Toyota Corolla or similar',
      price: 45,
      currency: 'USD',
      pricePerDay: true,
      image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=2069&auto=format&fit=crop',
      seats: 5,
      bags: 2,
      transmission: 'Automatic',
      airConditioning: true,
      supplier: 'Avis',
      location: 'Cairo Airport Terminal 1',
      availableVehicles: 3,
      pickupDate: '2025-05-15',
      pickupTime: '10:00 AM',
      returnDate: '2025-05-17',
      returnTime: '10:00 AM',
      features: ['Air Conditioning', 'Radio', 'ABS', 'Bluetooth']
    },
    {
      id: 2,
      type: 'SUV',
      name: 'Nissan X-Trail or similar',
      price: 75,
      currency: 'USD',
      pricePerDay: true,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop',
      seats: 7,
      bags: 4,
      transmission: 'Automatic',
      airConditioning: true,
      supplier: 'Hertz',
      location: 'Cairo Downtown',
      availableVehicles: 2,
      pickupDate: '2025-05-15',
      pickupTime: '10:00 AM',
      returnDate: '2025-05-17',
      returnTime: '10:00 AM',
      features: ['Air Conditioning', 'Radio', 'ABS', 'Bluetooth', 'GPS', 'Roof Rack']
    },
    {
      id: 3,
      type: 'Premium',
      name: 'Mercedes C-Class or similar',
      price: 95,
      currency: 'USD',
      pricePerDay: true,
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=2025&auto=format&fit=crop',
      seats: 5,
      bags: 3,
      transmission: 'Automatic',
      airConditioning: true,
      supplier: 'Europcar',
      location: 'Cairo Airport Terminal 2',
      availableVehicles: 1,
      pickupDate: '2025-05-15',
      pickupTime: '10:00 AM',
      returnDate: '2025-05-17',
      returnTime: '10:00 AM',
      features: ['Air Conditioning', 'Premium Sound System', 'ABS', 'Bluetooth', 'GPS', 'Leather Seats']
    }
  ];
  
  const buses = [
    {
      id: 1,
      company: 'Go Bus',
      route: 'Cairo to Alexandria',
      price: 15,
      currency: 'USD',
      departureLocation: 'Cairo Bus Terminal',
      arrivalLocation: 'Alexandria Bus Station',
      departureDate: '2025-05-15',
      departureTime: '08:00 AM',
      arrivalTime: '11:30 AM',
      duration: '3h 30m',
      busType: 'Deluxe',
      amenities: ['Air Conditioning', 'WiFi', 'Reclining Seats', 'USB Ports'],
      availableSeats: 12
    },
    {
      id: 2,
      company: 'Blue Bus',
      route: 'Cairo to Alexandria',
      price: 12,
      currency: 'USD',
      departureLocation: 'Cairo Bus Terminal',
      arrivalLocation: 'Alexandria Bus Station',
      departureDate: '2025-05-15',
      departureTime: '09:30 AM',
      arrivalTime: '01:15 PM',
      duration: '3h 45m',
      busType: 'Standard',
      amenities: ['Air Conditioning', 'WiFi'],
      availableSeats: 8
    },
    {
      id: 3,
      company: 'Go Bus',
      route: 'Cairo to Alexandria',
      price: 18,
      currency: 'USD',
      departureLocation: 'Cairo Bus Terminal',
      arrivalLocation: 'Alexandria Bus Station',
      departureDate: '2025-05-15',
      departureTime: '10:45 AM',
      arrivalTime: '02:00 PM',
      duration: '3h 15m',
      busType: 'VIP',
      amenities: ['Air Conditioning', 'WiFi', 'Reclining Seats', 'USB Ports', 'Refreshments', 'Entertainment'],
      availableSeats: 5
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Transportation Search Results</h1>
          <p className="text-lg text-muted-foreground">
            Cairo, Egypt - May 15-17, 2025
          </p>
        </div>

        <Tabs defaultValue="cars">
          <TabsList className="mb-6">
            <TabsTrigger value="cars">
              <CarIcon className="mr-2" size={16} /> Cars
            </TabsTrigger>
            <TabsTrigger value="buses">
              <BusIcon className="mr-2" size={16} /> Buses
            </TabsTrigger>
            <TabsTrigger value="trains">
              <TrainIcon className="mr-2" size={16} /> Trains
            </TabsTrigger>
            <TabsTrigger value="boats">
              <BoatIcon className="mr-2" size={16} /> Boats
            </TabsTrigger>
          </TabsList>

          {/* Cars Tab Content */}
          <TabsContent value="cars">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filter sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Filter Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Price Range (per day)</h3>
                      <div className="flex items-center gap-2">
                        <input 
                          type="range" 
                          min="0" 
                          max="200" 
                          className="w-full" 
                          value="100"
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>$0</span>
                        <span>$200</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Car Type</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="economy" className="mr-2" checked />
                          <label htmlFor="economy">Economy</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="compact" className="mr-2" checked />
                          <label htmlFor="compact">Compact</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="suv" className="mr-2" checked />
                          <label htmlFor="suv">SUV</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="premium" className="mr-2" checked />
                          <label htmlFor="premium">Premium</label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Transmission</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="automatic" className="mr-2" checked />
                          <label htmlFor="automatic">Automatic</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="manual" className="mr-2" />
                          <label htmlFor="manual">Manual</label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Supplier</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="avis" className="mr-2" checked />
                          <label htmlFor="avis">Avis</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="hertz" className="mr-2" checked />
                          <label htmlFor="hertz">Hertz</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="europcar" className="mr-2" checked />
                          <label htmlFor="europcar">Europcar</label>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full">Apply Filters</Button>
                  </CardContent>
                </Card>
              </div>

              {/* Car results */}
              <div className="lg:col-span-3 space-y-4">
                {cars.map(car => (
                  <Card key={car.id} className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                      <div className="md:col-span-4 h-[200px] md:h-full">
                        <img 
                          src={car.image} 
                          alt={car.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="md:col-span-8">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <Badge className="mb-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                                {car.type}
                              </Badge>
                              <CardTitle className="text-xl">{car.name}</CardTitle>
                              <div className="flex items-center mt-1">
                                <Badge variant="outline" className="mr-2">
                                  <UsersIcon size={14} className="mr-1" />
                                  {car.seats} Seats
                                </Badge>
                                <Badge variant="outline" className="mr-2">
                                  {car.bags} Bags
                                </Badge>
                                <Badge variant="outline" className="mr-2">
                                  <SettingsIcon size={14} className="mr-1" />
                                  {car.transmission}
                                </Badge>
                                {car.airConditioning && (
                                  <Badge variant="outline">
                                    <AirVentIcon size={14} className="mr-1" />
                                    A/C
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{car.supplier}</div>
                              <div className="text-xs text-muted-foreground">{car.availableVehicles} vehicles left</div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="py-2">
                          <div className="flex items-center text-sm mb-2">
                            <MapPinIcon size={14} className="mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">{car.location}</span>
                          </div>
                          
                          <div className="flex items-center text-sm mb-3">
                            <CalendarIcon size={14} className="mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {car.pickupDate} {car.pickupTime} - {car.returnDate} {car.returnTime}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {car.features.map((feature, index) => (
                              <Badge key={index} variant="outline">{feature}</Badge>
                            ))}
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex justify-between items-center pt-2">
                          <div>
                            <div className="text-2xl font-bold">
                              {car.currency} {car.price}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {car.pricePerDay ? 'per day' : 'total'}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" onClick={() => window.location.href = `/transportation/${car.id}`}>
                              View Details
                            </Button>
                            <Button>Rent Now</Button>
                          </div>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Buses Tab Content */}
          <TabsContent value="buses">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filter sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Filter Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Departure Time</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="morning-bus" className="mr-2" checked />
                          <label htmlFor="morning-bus">Morning (6AM - 12PM)</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="afternoon-bus" className="mr-2" checked />
                          <label htmlFor="afternoon-bus">Afternoon (12PM - 6PM)</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="evening-bus" className="mr-2" />
                          <label htmlFor="evening-bus">Evening (After 6PM)</label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Bus Type</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="standard" className="mr-2" checked />
                          <label htmlFor="standard">Standard</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="deluxe" className="mr-2" checked />
                          <label htmlFor="deluxe">Deluxe</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="vip" className="mr-2" checked />
                          <label htmlFor="vip">VIP</label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Bus Company</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="gobus" className="mr-2" checked />
                          <label htmlFor="gobus">Go Bus</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="bluebus" className="mr-2" checked />
                          <label htmlFor="bluebus">Blue Bus</label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Amenities</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="wifi-bus" className="mr-2" checked />
                          <label htmlFor="wifi-bus">WiFi</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="ac-bus" className="mr-2" checked />
                          <label htmlFor="ac-bus">Air Conditioning</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="usb-bus" className="mr-2" checked />
                          <label htmlFor="usb-bus">USB Ports</label>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full">Apply Filters</Button>
                  </CardContent>
                </Card>
              </div>

              {/* Bus results */}
              <div className="lg:col-span-3 space-y-4">
                {buses.map(bus => (
                  <Card key={bus.id} className="overflow-hidden">
                    <div className="bg-muted p-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <BusIcon size={18} className="mr-2" />
                        <span className="font-medium">{bus.company}</span>
                        <Badge className="ml-3">{bus.busType}</Badge>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon size={16} className="mr-1" />
                        <span className="text-sm">{bus.departureDate}</span>
                      </div>
                    </div>
                    
                    <CardContent className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
                      <div className="md:col-span-9 flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex flex-col items-center text-center mb-4 md:mb-0">
                          <div className="text-2xl font-bold">{bus.departureTime}</div>
                          <div className="text-sm text-muted-foreground mt-1">{bus.departureLocation}</div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="text-sm font-medium">{bus.duration}</div>
                          <div className="w-32 md:w-40 h-[2px] bg-muted relative my-2"></div>
                        </div>
                        
                        <div className="flex flex-col items-center text-center">
                          <div className="text-2xl font-bold">{bus.arrivalTime}</div>
                          <div className="text-sm text-muted-foreground mt-1">{bus.arrivalLocation}</div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-3 flex flex-col justify-between items-center md:border-l md:pl-4">
                        <div className="text-2xl font-bold mb-2">
                          {bus.currency} {bus.price}
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">{bus.availableSeats} seats left</div>
                        <Button className="w-full">Select</Button>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="px-4 py-3 bg-muted/20">
                      <div className="flex flex-wrap gap-2">
                        {bus.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            {amenity === 'WiFi' && <WifiIcon size={12} />}
                            {amenity === 'Air Conditioning' && <AirVentIcon size={12} />}
                            <span>{amenity}</span>
                          </Badge>
                        ))}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
                
                <div className="flex justify-center mt-6">
                  <Button variant="outline" className="mr-2">Previous</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Trains Tab Content */}
          <TabsContent value="trains" className="mt-4">
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <TrainIcon size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Train Search Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  We're currently working on adding train options to our platform.
                  Please check back later for updates.
                </p>
                <Button variant="outline">
                  <SearchIcon className="mr-2" size={16} />
                  Explore Other Transportation Options
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Boats Tab Content */}
          <TabsContent value="boats" className="mt-4">
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <BoatIcon size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Boat Search Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  We're currently working on adding boat options to our platform.
                  Please check back later for updates.
                </p>
                <Button variant="outline">
                  <SearchIcon className="mr-2" size={16} />
                  Explore Other Transportation Options
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TransportationSearchResults;