import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useLocation } from 'wouter';
import { 
  Plane as PlaneIcon, 
  PlaneLanding as PlaneLandingIcon, 
  PlaneTakeoff as PlaneTakeoffIcon, 
  Clock as ClockIcon,
  Users as UsersIcon,
  RotateCcw as RotateCcwIcon,
  Calendar as CalendarIcon,
  Armchair as ArmchairIcon,
  Filter as FilterIcon
} from 'lucide-react';
import { flightsData, Flight, FlightsFilterState, defaultFlightsFilter, filterFlights, searchFlights, airlines, airportList } from '@/data/flights';

const FlightsSearchResults: React.FC = () => {
  const [location] = useLocation();

  // Parse URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const fromAirport = searchParams.get('from') || 'CAI';
  const toAirport = searchParams.get('to') || 'LGW';
  const date = searchParams.get('date') || '2025-04-25';
  const passengers = parseInt(searchParams.get('passengers') || '1', 10);
  const flightClass = searchParams.get('class') || 'Economy';

  // Get airport details
  const fromAirportDetails = airportList.find(airport => airport.code === fromAirport);
  const toAirportDetails = airportList.find(airport => airport.code === toAirport);

  // Default search parameters if URL params are missing
  const searchCriteria = {
    fromAirport: fromAirport,
    fromCity: fromAirportDetails?.city || 'Cairo',
    fromCountry: fromAirportDetails?.country || 'Egypt',
    toAirport: toAirport,
    toCity: toAirportDetails?.city || 'London',
    toCountry: toAirportDetails?.country || 'UK',
    date: date,
    passengers: passengers,
    flightClass: flightClass
  };

  const [filters, setFilters] = useState<FlightsFilterState>({...defaultFlightsFilter});
  const [allFlights, setAllFlights] = useState<Flight[]>(flightsData);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<number[]>([]);
  const [selectedDepartureTimes, setSelectedDepartureTimes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([defaultFlightsFilter.minPrice, defaultFlightsFilter.maxPrice]);
  const [selectedClass, setSelectedClass] = useState<string[]>([]);

  // Initial filtering when component mounts to show the specific search results
  useEffect(() => {
    // Find flights matching the search criteria
    const foundFlights = allFlights.filter(flight => 
      flight.departureAirport === searchCriteria.fromAirport &&
      flight.arrivalAirport === searchCriteria.toAirport &&
      flight.class === searchCriteria.flightClass &&
      flight.availableSeats >= searchCriteria.passengers
    );
    
    // If no exact date match required, we can just filter by airports and class
    // For demonstration purposes, show some results even if date doesn't match exactly
    if (foundFlights.length === 0) {
      const alternateFlights = allFlights.filter(flight => 
        flight.departureAirport === searchCriteria.fromAirport &&
        flight.arrivalAirport === searchCriteria.toAirport &&
        flight.class === searchCriteria.flightClass
      );
      setFilteredFlights(alternateFlights);
    } else {
      setFilteredFlights(foundFlights);
    }
  }, [allFlights, searchCriteria]);

  // Apply filters when filter state changes
  const applyFilters = () => {
    const newFilters: FlightsFilterState = {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      airlines: selectedAirlines,
      stops: selectedStops,
      departureTime: selectedDepartureTimes,
      class: selectedClass
    };
    
    setFilters(newFilters);
    
    // First filter by search parameters, then apply additional filters
    const matchingSearchFlights = allFlights.filter(flight => 
      flight.departureAirport === searchCriteria.fromAirport &&
      flight.arrivalAirport === searchCriteria.toAirport &&
      flight.availableSeats >= searchCriteria.passengers
    );
    
    const filtered = filterFlights(matchingSearchFlights, newFilters);
    setFilteredFlights(filtered);
  };

  // Handle airline selection
  const handleAirlineChange = (airline: string, checked: boolean) => {
    if (checked) {
      setSelectedAirlines(prev => [...prev, airline]);
    } else {
      setSelectedAirlines(prev => prev.filter(a => a !== airline));
    }
  };

  // Handle stops selection
  const handleStopsChange = (stops: number, checked: boolean) => {
    if (checked) {
      setSelectedStops(prev => [...prev, stops]);
    } else {
      setSelectedStops(prev => prev.filter(s => s !== stops));
    }
  };

  // Handle departure time selection
  const handleDepartureTimeChange = (time: string, checked: boolean) => {
    if (checked) {
      setSelectedDepartureTimes(prev => [...prev, time]);
    } else {
      setSelectedDepartureTimes(prev => prev.filter(t => t !== time));
    }
  };

  // Handle class selection
  const handleClassChange = (flightClass: string, checked: boolean) => {
    if (checked) {
      setSelectedClass(prev => [...prev, flightClass]);
    } else {
      setSelectedClass(prev => prev.filter(c => c !== flightClass));
    }
  };

  // Format date for display (YYYY-MM-DD to readable format)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Flight Search Results</h1>
        <p className="text-lg text-muted-foreground">
          {fromAirportDetails?.name || "Cairo International Airport"} ({searchCriteria.fromAirport}) – {searchCriteria.fromCity}, {searchCriteria.fromCountry} to {toAirportDetails?.name || "Gatwick Airport"} ({searchCriteria.toAirport}) – {searchCriteria.toCity}, {searchCriteria.toCountry} - {formatDate(searchCriteria.date)} - {searchCriteria.passengers} Passenger{searchCriteria.passengers !== 1 ? 's' : ''}, {searchCriteria.flightClass}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FilterIcon className="mr-2" size={18} />
                Filter Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="flex items-center gap-2">
                  <Slider
                    defaultValue={[priceRange[0], priceRange[1]]}
                    max={2500}
                    min={300}
                    step={50}
                    onValueChange={(value) => setPriceRange([value[0], value[1]])}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Airlines</h3>
                <div className="space-y-2">
                  {airlines.slice(0, 5).map(airline => (
                    <div key={airline.id} className="flex items-center">
                      <Checkbox 
                        id={`airline-${airline.id}`}
                        className="mr-2"
                        onCheckedChange={(checked) => 
                          handleAirlineChange(airline.name, checked === true)
                        }
                      />
                      <Label htmlFor={`airline-${airline.id}`}>{airline.name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Stops</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="nonstop" 
                      className="mr-2"
                      onCheckedChange={(checked) => 
                        handleStopsChange(0, checked === true)
                      }
                    />
                    <Label htmlFor="nonstop">Non-stop</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="1stop" 
                      className="mr-2"
                      onCheckedChange={(checked) => 
                        handleStopsChange(1, checked === true)
                      }
                    />
                    <Label htmlFor="1stop">1 Stop</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Departure Time</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="morning" 
                      className="mr-2"
                      onCheckedChange={(checked) => 
                        handleDepartureTimeChange('morning', checked === true)
                      }
                    />
                    <Label htmlFor="morning">Morning (6AM - 12PM)</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="afternoon" 
                      className="mr-2"
                      onCheckedChange={(checked) => 
                        handleDepartureTimeChange('afternoon', checked === true)
                      }
                    />
                    <Label htmlFor="afternoon">Afternoon (12PM - 6PM)</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="evening" 
                      className="mr-2"
                      onCheckedChange={(checked) => 
                        handleDepartureTimeChange('evening', checked === true)
                      }
                    />
                    <Label htmlFor="evening">Evening (After 6PM)</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Class</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="economy" 
                      className="mr-2"
                      onCheckedChange={(checked) => 
                        handleClassChange('Economy', checked === true)
                      }
                    />
                    <Label htmlFor="economy">Economy</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="business" 
                      className="mr-2"
                      onCheckedChange={(checked) => 
                        handleClassChange('Business', checked === true)
                      }
                    />
                    <Label htmlFor="business">Business</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="first" 
                      className="mr-2"
                      onCheckedChange={(checked) => 
                        handleClassChange('First', checked === true)
                      }
                    />
                    <Label htmlFor="first">First</Label>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={applyFilters}>
                Apply Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Flight results */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <span className="text-sm text-muted-foreground">
                {filteredFlights.length} flights found
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <select className="p-2 border rounded-md text-sm">
                <option value="price">Price (lowest first)</option>
                <option value="duration">Duration (shortest first)</option>
                <option value="departure">Departure (earliest first)</option>
              </select>
            </div>
          </div>

          {filteredFlights.length > 0 ? (
            <div className="space-y-4">
              {filteredFlights.map(flight => (
                <Card key={flight.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-muted p-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <PlaneIcon size={18} className="mr-2" />
                      <span className="font-medium">{flight.airline}</span>
                      <span className="text-sm text-muted-foreground ml-2">Flight {flight.flightNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon size={16} className="mr-1" />
                      <span className="text-sm">{flight.date}</span>
                    </div>
                  </div>
                  
                  <CardContent className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
                    <div className="md:col-span-9 flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex flex-col items-center text-center mb-4 md:mb-0">
                        <div className="text-2xl font-bold">{flight.departureTime}</div>
                        <div className="text-lg font-medium">{flight.departureAirport}</div>
                        <div className="text-sm text-muted-foreground">{flight.departureCity}</div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-medium">{flight.duration}</div>
                        <div className="w-32 md:w-40 h-[2px] bg-muted relative my-2">
                          {flight.stops > 0 && (
                            <div className="w-2 h-2 bg-primary rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop (${flight.stopAirport})`}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        <div className="text-2xl font-bold">{flight.arrivalTime}</div>
                        <div className="text-lg font-medium">{flight.arrivalAirport}</div>
                        <div className="text-sm text-muted-foreground">{flight.arrivalCity}</div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-3 flex flex-col justify-between items-center md:border-l md:pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArmchairIcon size={16} />
                        <span>{flight.class}</span>
                      </div>
                      <div className="text-2xl font-bold mb-2">
                        {flight.currency} {flight.price}
                      </div>
                      <Button className="w-full">Select</Button>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="px-4 py-3 bg-muted/20 flex justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-muted/30">
                        <UsersIcon size={14} className="mr-1" /> {flight.availableSeats} seats left
                      </Badge>
                      
                      {flight.stops === 0 ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Direct
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          {flight.stops} Stop
                        </Badge>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <RotateCcwIcon size={14} className="mr-1" /> Flight Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {filteredFlights.length > 10 && (
                <div className="flex justify-center mt-6">
                  <Button variant="outline" className="mr-2">Previous</Button>
                  <Button variant="outline">Next</Button>
                </div>
              )}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="text-xl font-medium mb-2">No flights found</h3>
              <p className="text-muted-foreground mb-4">
                No flights match your current filter criteria. Try adjusting your filters.
              </p>
              <Button onClick={() => {
                setFilters({...defaultFlightsFilter});
                setPriceRange([defaultFlightsFilter.minPrice, defaultFlightsFilter.maxPrice]);
                setSelectedAirlines([]);
                setSelectedStops([]);
                setSelectedDepartureTimes([]);
                setSelectedClass([]);
                setFilteredFlights(flightsData);
              }}>
                Reset Filters
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightsSearchResults;