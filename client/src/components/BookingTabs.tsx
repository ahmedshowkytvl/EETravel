import React, { useState, useEffect, FormEvent, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  PlaneIcon,
  BuildingIcon,
  Tickets,
  RouteIcon,
  PackageIcon,
  PlaneLandingIcon,
  PlaneTakeoffIcon,
  CalendarIcon,
  UsersIcon,
  ArmchairIcon,
  GlobeIcon,
  Landmark,
  MoonIcon,
  StarIcon,
  FlagIcon,
  ClockIcon,
  DollarSignIcon,
  MapPinIcon,
  Mountain,
  TagIcon,
  SearchIcon,
  CarIcon,
  BusIcon,
  TrainIcon,
  Ship as BoatIcon,
  ShieldIcon,
  ChevronDown,
  MinusIcon,
  PlusIcon,
  Baby,
  User as UserIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AirportSelector from "./AirportSelector";
import type { LucideIcon, LucideProps } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";

// Define the tab structure
const createTabs = (t: (key: string, defaultText?: string) => string) => [
  { id: "flights", icon: PlaneIcon, label: t('tabs.flights', 'Flights') },
  { id: "hotels", icon: BuildingIcon, label: t('tabs.hotels', 'Hotels') },
  { id: "transportation", icon: CarIcon, label: t('tabs.transportation', 'Transportation') },
  { id: "visas", icon: Tickets, label: t('tabs.visas', 'Visas') },
  { id: "trips", icon: RouteIcon, label: t('tabs.tours', 'Tours') },
  { id: "packages", icon: PackageIcon, label: t('tabs.packages', 'Packages') },
];

interface Country {
  id: number;
  name: string;
  code: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
}

interface City {
  id: number;
  name: string;
  countryId: number;
  description?: string;
  imageUrl?: string;
  active: boolean;
}

const BookingTabs: React.FC = () => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("flights");
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  
  // Fetch tour categories for the trip type dropdown
  const { data: tourCategories = [] } = useQuery<any[]>({
    queryKey: ['/api/tour-categories'],
    select: (data: any[]) => 
      data
        .filter((category: any) => category.active)
        .map((category: any) => ({
          value: category.name.toLowerCase(),
          label: category.name
        }))
  });

  // Reusable style for tab content wrappers
  const tabContentStyle = { minWidth: "min(800px, 100vw - 40px)" };
  // Get today's date in YYYY-MM-DD format for default values
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // State for dates
  const [checkInDate, setCheckInDate] = useState<string>(getTodayDate());
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [nights, setNights] = useState<number>(1);

  // State for guests
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);

  // State for country and city
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null,
  );
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedPackageCountryId, setSelectedPackageCountryId] = useState<
    number | null
  >(null);
  const [selectedPackageCityId, setSelectedPackageCityId] = useState<
    number | null
  >(null);

  // State for flight origin and destination airports
  const [departureAirport, setDepartureAirport] = useState<{
    airportId: number | null;
    cityId: number | null;
    displayText: string;
  }>({ airportId: null, cityId: null, displayText: "" });

  const [arrivalAirport, setArrivalAirport] = useState<{
    airportId: number | null;
    cityId: number | null;
    displayText: string;
  }>({ airportId: null, cityId: null, displayText: "" });

  // Fetch countries and cities
  const { data: countries = [] } = useQuery<Country[]>({
    queryKey: ["/api/countries"],
    refetchOnWindowFocus: false,
  });

  const { data: cities = [] } = useQuery<City[]>({
    queryKey: ["/api/cities"],
    refetchOnWindowFocus: false,
  });

  // Filter cities based on selected country
  const filteredCities = selectedCountryId
    ? cities.filter((city) => city.countryId === selectedCountryId)
    : cities;

  const filteredPackageCities = selectedPackageCountryId
    ? cities.filter((city) => city.countryId === selectedPackageCountryId)
    : cities;

  // Handle country selection to update cities
  const handleCountryChange = (countryId: string) => {
    const id = parseInt(countryId);
    setSelectedCountryId(id);
    // Clear city selection when country changes
    setSelectedCityId(null);
  };

  // Handle city selection to update country if needed
  const handleCityChange = (cityId: string) => {
    const id = parseInt(cityId);
    setSelectedCityId(id);

    // Find the city and update country if needed
    const city = cities.find((c) => c.id === id);
    if (city && (!selectedCountryId || city.countryId !== selectedCountryId)) {
      setSelectedCountryId(city.countryId);
    }
  };

  // Handlers for package tab country-city relation
  const handlePackageCountryChange = (countryId: string) => {
    const id = parseInt(countryId);
    setSelectedPackageCountryId(id);
    // Clear city selection when country changes
    setSelectedPackageCityId(null);
  };

  const handlePackageCityChange = (cityId: string) => {
    const id = parseInt(cityId);
    setSelectedPackageCityId(id);

    // Find the city and update country if needed
    const city = cities.find((c) => c.id === id);
    if (
      city &&
      (!selectedPackageCountryId || city.countryId !== selectedPackageCountryId)
    ) {
      setSelectedPackageCountryId(city.countryId);
    }
  };

  // Calculate nights when check-in or check-out dates change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      // Calculate difference in days
      const diffTime = checkOut.getTime() - checkIn.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Update nights only if it's a positive number
      if (diffDays > 0) {
        setNights(diffDays);
      }
    }
  }, [checkInDate, checkOutDate]);

  // Update check-out date when nights change
  const handleNightsChange = (newNights: number) => {
    // Ensure nights is at least 1
    const updatedNights = Math.max(1, newNights);

    // If check-in date is selected, update check-out date based on nights
    if (checkInDate) {
      const checkIn = new Date(checkInDate);
      const newCheckOut = new Date(checkIn);
      newCheckOut.setDate(checkIn.getDate() + updatedNights);

      // Format to yyyy-mm-dd for the input
      const year = newCheckOut.getFullYear();
      const month = String(newCheckOut.getMonth() + 1).padStart(2, "0");
      const day = String(newCheckOut.getDate()).padStart(2, "0");

      setCheckOutDate(`${year}-${month}-${day}`);
    }

    // Always update nights state regardless of date selection
    setNights(updatedNights);
  };

  // Handle guest count changes
  const incrementAdults = () => setAdults((prev) => prev + 1);
  const decrementAdults = () =>
    setAdults((prev) => (prev > 1 ? prev - 1 : prev));

  const incrementChildren = () => setChildren((prev) => prev + 1);
  const decrementChildren = () =>
    setChildren((prev) => (prev > 0 ? prev - 1 : prev));

  const incrementInfants = () => setInfants((prev) => prev + 1);
  const decrementInfants = () =>
    setInfants((prev) => (prev > 0 ? prev - 1 : prev));

  // Handle tab click - sets active tab and scrolls to center it
  const handleTabClick = (tabId: string, index: number) => {
    setActiveTab(tabId);

    setTimeout(() => {
      if (window.innerWidth <= 1023 && tabsContainerRef.current) {
        const container = tabsContainerRef.current;
        const buttons = Array.from(
          container.querySelectorAll("button"),
        ) as HTMLElement[];

        const button = buttons[index];
        if (button) {
          const containerCenter = container.clientWidth / 2;
          const buttonCenter = button.offsetLeft + button.offsetWidth / 2;
          const scrollLeft = buttonCenter - containerCenter;

          const maxScrollLeft = container.scrollWidth - container.clientWidth;
          const finalScrollLeft = Math.max(
            0,
            Math.min(scrollLeft, maxScrollLeft),
          );

          container.scrollTo({
            left: finalScrollLeft,
            behavior: "smooth",
          });
        }
      }
    }, 150);
  };

  // Add CSS to hide scrollbar
  useEffect(() => {
    // Add CSS to hide the scrollbar on WebKit browsers
    const style = document.createElement("style");
    style.textContent = `
      .tabs-scrollbar-hidden::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Form submission handlers
  const handleFlightsSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Get flight date from input
    const flightDateInput = document.getElementById(
      "flight-date",
    ) as HTMLInputElement;
    const flightDate = flightDateInput?.value || "";

    // Get flight class from select
    const flightClassSelect = document.getElementById(
      "flight-class",
    ) as HTMLSelectElement;
    const flightClass = flightClassSelect?.value || "economy";

    // Build query params
    const params = new URLSearchParams();
    if (departureAirport.displayText) {
      const airportCode =
        departureAirport.displayText.match(/\(([A-Z]{3})\)/)?.[1];
      if (airportCode) params.append("from", airportCode);
    }
    if (arrivalAirport.displayText) {
      const airportCode =
        arrivalAirport.displayText.match(/\(([A-Z]{3})\)/)?.[1];
      if (airportCode) params.append("to", airportCode);
    }
    if (flightDate) params.append("date", flightDate);
    params.append("passengers", (adults + children + infants).toString());
    params.append(
      "class",
      flightClass.charAt(0).toUpperCase() + flightClass.slice(1),
    ); // Capitalize first letter

    // Navigate to flight search with query params
    setLocation(`/search/flights?${params.toString()}`);
  };

  const handleHotelsSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLocation("/search/hotels");
  };

  const handleTransportationSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLocation("/search/transportation");
  };

  const handleVisasSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLocation("/search/visas");
  };

  const handleToursSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLocation("/search/tours");
  };

  const handlePackagesSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Get package form inputs
    const packageDateInput = document.getElementById(
      "package-date",
    ) as HTMLInputElement;
    const packageDate = packageDateInput?.value || "";

    const packageDurationSelect = document.getElementById(
      "package-duration",
    ) as HTMLSelectElement;
    const packageDuration = packageDurationSelect?.value || "";

    // Get type of experience selected
    const packageTypeSelect = document.getElementById(
      "package-type",
    ) as HTMLSelectElement;
    const packageType = packageTypeSelect?.value || "";

    // Build query params
    const params = new URLSearchParams();
    if (selectedPackageCountryId) {
      // Get country name from ID
      const country = countries.find((c) => c.id === selectedPackageCountryId);
      if (country) params.append("country", country.name);
    }
    if (selectedPackageCityId) {
      // Get city name from ID
      const city = cities.find((c) => c.id === selectedPackageCityId);
      if (city) params.append("city", city.name);
    }
    if (packageDate) params.append("date", packageDate);
    if (packageDuration) params.append("duration", packageDuration);
    if (packageType) params.append("type", packageType);
    params.append("adults", adults.toString());
    params.append("children", children.toString());
    params.append("infants", infants.toString());

    // Navigate to packages search with query params
    setLocation(`/search/packages?${params.toString()}`);
  };

  // Import useLanguage hook here to detect RTL mode
  const { isRTL, t } = useLanguage();
  
  // Create tabs with translations
  const TABS = createTabs(t);

  return (
    <section className="booking-tabs relative -mt-16 md:-mt-24 z-10 bg-transparent">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="inline-block rounded-xl shadow-md overflow-hidden">
          {/* Tabs */}
          <div
            ref={tabsContainerRef}
            className="inline-flex border-b overflow-x-auto bg-transparent tabs-scrollbar-hidden scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {TABS.map((tab, index) => {
              const Icon = tab.icon;
              const isFirst = index === 0;
              const isLast = index === TABS.length - 1;

              // Dynamically determine corner rounding based on RTL/LTR
              const firstButtonClass = isRTL
                ? isFirst
                  ? "rounded-tr-xl"
                  : ""
                : isFirst
                  ? "rounded-tl-xl"
                  : "";

              const lastButtonClass = isRTL
                ? isLast
                  ? "rounded-tl-xl"
                  : ""
                : isLast
                  ? "rounded-tr-xl"
                  : "";

              return (
                <button
                  key={tab.id}
                  className={`py-4 px-6 font-medium text-base flex bg-white items-center whitespace-nowrap 
                    ${activeTab === tab.id ? "tab-active" : ""}
                    ${firstButtonClass}
                    ${lastButtonClass}
                  `}
                  onClick={() => handleTabClick(tab.id, index)}
                >
                  <Icon className={`${isRTL ? "ml-2" : "mr-2"}`} size={18} />{" "}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div
            className={`booking-tab-content bg-white shadow-md p-6 
              ${isRTL ? "rounded-br-xl rounded-tl-xl" : "rounded-bl-xl rounded-tr-xl"}
            `}
            style={{
              minWidth: "min(900px, 100vw - 40px)",
            }}
            id="BookingTabs-Container"
          >
            {/* Flights Tab */}
            <form
              id="flights-tab"
              className={`tab-content ${activeTab === "flights" ? "active" : ""}`}
              onSubmit={handleFlightsSubmit}
            >
              <div style={tabContentStyle}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <AirportSelector
                    id="flight-from"
                    label={t('flights.from', 'From')}
                    icon={PlaneTakeoffIcon}
                    value={departureAirport}
                    onChange={setDepartureAirport}
                    placeholder={t('flights.selectDepartureAirport', 'Select departure airport')}
                    className="lg:col-span-2"
                  />

                  <AirportSelector
                    id="flight-to"
                    label={t('flights.to', 'To')}
                    icon={PlaneLandingIcon}
                    value={arrivalAirport}
                    onChange={setArrivalAirport}
                    placeholder={t('flights.selectArrivalAirport', 'Select arrival airport')}
                    className="lg:col-span-2"
                  />

                  <div className="space-y-2">
                    <Label htmlFor="flight-date">{t('flights.date', 'Date')}</Label>
                    <div className="relative">
                      <CalendarIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Input
                        id="flight-date"
                        type="date"
                        className="pl-9"
                        defaultValue={getTodayDate()}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flight-passengers">{t('flights.passengers', 'Passengers')}</Label>
                    <div className="relative">
                      <UsersIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="flight-passengers"
                            className="w-full pl-9 flex justify-between"
                          >
                            <span>
                              {adults + children + infants} {adults + children + infants !== 1 
                                ? t('flights.passengers', 'Passengers') 
                                : t('flights.passenger', 'Passenger')}
                            </span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[240px] p-5" align="start">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{t('flights.adults', 'Adults')}</p>
                                <p className="text-sm text-muted-foreground">
                                  {t('flights.adultsAge', 'Age 12+')}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={decrementAdults}
                                  type="button"
                                >
                                  <MinusIcon className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center">
                                  {adults}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={incrementAdults}
                                  type="button"
                                >
                                  <PlusIcon className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{t('flights.children', 'Children')}</p>
                                <p className="text-sm text-muted-foreground">
                                  {t('flights.childrenAge', 'Age 2-11')}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={decrementChildren}
                                  type="button"
                                >
                                  <MinusIcon className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center">
                                  {children}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={incrementChildren}
                                  type="button"
                                >
                                  <PlusIcon className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{t('flights.infants', 'Infants')}</p>
                                <p className="text-sm text-muted-foreground">
                                  {t('flights.infantsAge', 'Under 2')}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={decrementInfants}
                                  type="button"
                                >
                                  <MinusIcon className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center">
                                  {infants}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={incrementInfants}
                                  type="button"
                                >
                                  <PlusIcon className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flight-class">{t('flights.class', 'Class')}</Label>
                    <div className="relative">
                      <ArmchairIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select>
                        <SelectTrigger id="flight-class" className="pl-9">
                          <SelectValue placeholder={t('flights.selectClass', 'Select class')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="economy">{t('flights.economy', 'Economy')}</SelectItem>
                          <SelectItem value="business">{t('flights.business', 'Business')}</SelectItem>
                          <SelectItem value="first">{t('flights.firstClass', 'First Class')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <SearchIcon className={`${isRTL ? 'ml-2' : 'mr-2'}`} size={18} /> {t('buttons.searchFlights', 'Search Flights')}
                  </Button>
                </div>
              </div>
            </form>

            {/* Hotels Tab */}
            <form
              id="hotels-tab"
              className={`tab-content ${activeTab === "hotels" ? "active" : ""}`}
              onSubmit={handleHotelsSubmit}
            >
              <div style={tabContentStyle}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotel-country">{t('hotels.country', 'Country')}</Label>
                    <div className="relative">
                      <GlobeIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select
                        value={selectedCountryId?.toString() || ""}
                        onValueChange={handleCountryChange}
                      >
                        <SelectTrigger id="hotel-country" className="pl-9">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.id}
                              value={country.id.toString()}
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hotel-city">City</Label>
                    <div className="relative">
                      <Landmark
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select
                        value={selectedCityId?.toString() || ""}
                        onValueChange={handleCityChange}
                      >
                        <SelectTrigger id="hotel-city" className="pl-9">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredCities.map((city) => (
                            <SelectItem
                              key={city.id}
                              value={city.id.toString()}
                            >
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hotel-checkin">Check-in</Label>
                    <div className="relative">
                      <CalendarIcon
                        className="absolute left-3 top-3 text-neutral-500 "
                        size={18}
                      />
                      <Input
                        id="hotel-checkin"
                        type="date"
                        className="pl-9"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hotel-checkout">Check-out</Label>
                    <div className="relative">
                      <CalendarIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Input
                        id="hotel-checkout"
                        type="date"
                        className="pl-9"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hotel-nights">Nights</Label>
                    <div className="relative flex items-center">
                      <MoonIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Input
                        id="hotel-nights"
                        type="number"
                        min="1"
                        className="pl-9"
                        value={nights}
                        onChange={(e) =>
                          handleNightsChange(parseInt(e.target.value))
                        }
                      />
                      <div className="absolute right-2 flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            nights > 1 && handleNightsChange(nights - 1)
                          }
                          type="button"
                        >
                          -
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleNightsChange(nights + 1)}
                          type="button"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hotel-guests">Guests</Label>
                    <div className="relative">
                      <UsersIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="hotel-guests"
                            className="w-full pl-9 flex justify-between"
                          >
                            <span className="text-muted-foreground">
                              {adults + children + infants} Guest
                              {adults + children + infants !== 1 ? "s" : ""}
                            </span>
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-4 space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label htmlFor="adults">Adults</Label>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={decrementAdults}
                                  type="button"
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center">
                                  {adults}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={incrementAdults}
                                  type="button"
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <Label htmlFor="children">Children</Label>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={decrementChildren}
                                  type="button"
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center">
                                  {children}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={incrementChildren}
                                  type="button"
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <Label htmlFor="infants">Infants</Label>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={decrementInfants}
                                  type="button"
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center">
                                  {infants}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={incrementInfants}
                                  type="button"
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <SearchIcon className="mr-2" size={18} /> Find Hotels
                  </Button>
                </div>
              </div>
            </form>

            {/* Transportation Tab */}
            <form
              id="transportation-tab"
              className={`tab-content ${activeTab === "transportation" ? "active" : ""}`}
              onSubmit={handleTransportationSubmit}
            >
              <div style={tabContentStyle}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transport-pickup">Pickup Point</Label>
                    <div className="relative">
                      <MapPinIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select>
                        <SelectTrigger id="transport-pickup" className="pl-9">
                          <SelectValue placeholder="Select Pickup Point" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cairo">Cairo, Egypt</SelectItem>
                          <SelectItem value="dubai">Dubai, UAE</SelectItem>
                          <SelectItem value="petra">Petra, Jordan</SelectItem>
                          <SelectItem value="istanbul">
                            Istanbul, Turkey
                          </SelectItem>
                          <SelectItem value="marrakech">
                            Marrakech, Morocco
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transport-destination">Destination</Label>
                    <div className="relative">
                      <MapPinIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select>
                        <SelectTrigger
                          id="transport-destination"
                          className="pl-9"
                        >
                          <SelectValue placeholder="Select Destination" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cairo">Cairo, Egypt</SelectItem>
                          <SelectItem value="dubai">Dubai, UAE</SelectItem>
                          <SelectItem value="petra">Petra, Jordan</SelectItem>
                          <SelectItem value="istanbul">
                            Istanbul, Turkey
                          </SelectItem>
                          <SelectItem value="marrakech">
                            Marrakech, Morocco
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transport-type">Type</Label>
                    <div className="relative">
                      <CarIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select>
                        <SelectTrigger id="transport-type" className="pl-9">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="van">Van/Minibus</SelectItem>
                          <SelectItem value="jeep">Jeep/4x4</SelectItem>
                          <SelectItem value="bus">Bus</SelectItem>
                          <SelectItem value="boat">Boat/Yacht</SelectItem>
                          <SelectItem value="carriage">
                            Traditional Carriage
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transport-date">Date</Label>
                    <div className="relative">
                      <CalendarIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Input id="transport-date" type="date" className="pl-9" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transport-duration">Duration</Label>
                    <div className="relative">
                      <ClockIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select>
                        <SelectTrigger id="transport-duration" className="pl-9">
                          <SelectValue placeholder="Select Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="half-day">
                            Half Day (4-5 hours)
                          </SelectItem>
                          <SelectItem value="full-day">
                            Full Day (8-10 hours)
                          </SelectItem>
                          <SelectItem value="multi-day">Multi-day</SelectItem>
                          <SelectItem value="airport">
                            Airport Transfer
                          </SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transport-passengers">Passengers</Label>
                    <div className="relative">
                      <UsersIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select>
                        <SelectTrigger
                          id="transport-passengers"
                          className="pl-9"
                        >
                          <SelectValue placeholder="Select Passengers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2">1-2 Passengers</SelectItem>
                          <SelectItem value="3-4">3-4 Passengers</SelectItem>
                          <SelectItem value="5-8">5-8 Passengers</SelectItem>
                          <SelectItem value="9-12">9-12 Passengers</SelectItem>
                          <SelectItem value="13+">13+ Passengers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transport-driver">Driver</Label>
                    <div className="relative">
                      <UsersIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select>
                        <SelectTrigger id="transport-driver" className="pl-9">
                          <SelectValue placeholder="Driver Options" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self-drive">
                            Self-Driving
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <SearchIcon className="mr-2" size={18} /> Find
                    Transportation
                  </Button>
                </div>
              </div>
            </form>

            {/* Visas Tab */}
            <form
              id="visas-tab"
              className={`tab-content ${activeTab === "visas" ? "active" : ""}`}
              onSubmit={handleVisasSubmit}
            >
              <div style={tabContentStyle}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="visa-country">Destination Country</Label>
                    <div className="relative">
                      <FlagIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select>
                        <SelectTrigger id="visa-country" className="pl-9">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="egypt">Egypt</SelectItem>
                          <SelectItem value="uae">UAE</SelectItem>
                          <SelectItem value="saudi">Saudi Arabia</SelectItem>
                          <SelectItem value="qatar">Qatar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="visa-nationality">Passenger Nationality</Label>
                    <div className="relative">
                      <UsersIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select>
                        <SelectTrigger id="visa-nationality" className="pl-9">
                          <SelectValue placeholder="Select Nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="egyptian">Egyptian</SelectItem>
                          <SelectItem value="saudi">Saudi</SelectItem>
                          <SelectItem value="emirati">Emirati</SelectItem>
                          <SelectItem value="jordanian">Jordanian</SelectItem>
                          <SelectItem value="lebanese">Lebanese</SelectItem>
                          <SelectItem value="american">American</SelectItem>
                          <SelectItem value="british">British</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>


                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <SearchIcon className="mr-2" size={18} /> Find Visa Options
                  </Button>
                </div>
              </div>
            </form>

            {/* Tours Tab */}
            <form
              id="trips-tab"
              className={`tab-content ${activeTab === "trips" ? "active" : ""}`}
              onSubmit={handleToursSubmit}
            >
              <div style={tabContentStyle}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trip-destination">Destination</Label>
                    <div className="relative">
                      <MapPinIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select>
                        <SelectTrigger id="trip-destination" className="pl-9">
                          <SelectValue placeholder="Select Destination" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cairo">
                            Cairo & Pyramids
                          </SelectItem>
                          <SelectItem value="dubai">
                            Dubai & Abu Dhabi
                          </SelectItem>
                          <SelectItem value="petra">
                            Petra & Wadi Rum
                          </SelectItem>
                          <SelectItem value="istanbul">
                            Istanbul & Cappadocia
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trip-type">Trip Type</Label>
                    <div className="relative">
                      <Mountain
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select>
                        <SelectTrigger id="trip-type" className="pl-9">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {tourCategories.map((category: {value: string, label: string}) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trip-date">Date</Label>
                    <div className="relative">
                      <CalendarIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Input id="trip-date" type="date" className="pl-9" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trip-passengers">
                      Number of Passengers
                    </Label>
                    <div className="relative">
                      <UsersIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select>
                        <SelectTrigger id="trip-passengers" className="pl-9">
                          <SelectValue placeholder="Select Passengers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 passenger</SelectItem>
                          <SelectItem value="2-3">2-3 passengers</SelectItem>
                          <SelectItem value="4-6">4-6 passengers</SelectItem>
                          <SelectItem value="7-10">7-10 passengers</SelectItem>
                          <SelectItem value="11+">11+ passengers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <SearchIcon className="mr-2" size={18} /> Find Tours
                  </Button>
                </div>
              </div>
            </form>

            {/* Packages Tab */}
            <form
              id="packages-tab"
              className={`tab-content ${activeTab === "packages" ? "active" : ""}`}
              onSubmit={handlePackagesSubmit}
            >
              <div style={tabContentStyle}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="package-country">Country</Label>
                    <div className="relative">
                      <GlobeIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select
                        value={selectedPackageCountryId?.toString() || ""}
                        onValueChange={handlePackageCountryChange}
                      >
                        <SelectTrigger id="package-country" className="pl-9">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.id}
                              value={country.id.toString()}
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="package-city">City</Label>
                    <div className="relative">
                      <Landmark
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select
                        value={selectedPackageCityId?.toString() || ""}
                        onValueChange={handlePackageCityChange}
                      >
                        <SelectTrigger id="package-city" className="pl-9">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredPackageCities.map((city) => (
                            <SelectItem
                              key={city.id}
                              value={city.id.toString()}
                            >
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="package-nights">Nights</Label>
                    <div className="relative">
                      <MoonIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select>
                        <SelectTrigger id="package-nights" className="pl-9">
                          <SelectValue placeholder="Select Nights" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3-5">3-5 nights</SelectItem>
                          <SelectItem value="6-8">6-8 nights</SelectItem>
                          <SelectItem value="9-12">9-12 nights</SelectItem>
                          <SelectItem value="13+">13+ nights</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="package-type">Type</Label>
                    <div className="relative">
                      <TagIcon
                        className="absolute left-3 top-3 text-neutral-500"
                        size={18}
                      />
                      <Select>
                        <SelectTrigger id="package-type" className="pl-9">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="family">Family</SelectItem>
                          <SelectItem value="couples">Couples</SelectItem>
                          <SelectItem value="solo">Solo Traveler</SelectItem>
                          <SelectItem value="group">Group Tour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>



                <div className="mt-6 flex justify-center">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <SearchIcon className="mr-2" size={18} /> Find Packages
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingTabs;
