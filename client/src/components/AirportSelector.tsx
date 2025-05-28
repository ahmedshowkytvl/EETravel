import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';

interface Airport {
  id: number;
  name: string;
  code: string;
}

interface City {
  id: number;
  name: string;
  countryId: number;
  countryName: string;
  countryCode: string;
}

interface AirportGroup {
  city: City;
  airports: Airport[];
}

interface AirportSelectorProps {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  value: { airportId: number | null, cityId: number | null, displayText: string };
  onChange: (value: { airportId: number | null, cityId: number | null, displayText: string }) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const AirportSelector: React.FC<AirportSelectorProps> = ({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder = "Select airport",
  disabled = false,
  className
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get translations
  const { t, isRTL } = useLanguage();

  // Fetch airport groups data using the specialized endpoint
  const { data: airportGroups = [], isLoading, error } = useQuery<AirportGroup[]>({
    queryKey: ['/api/airport-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];
      const response = await fetch(`/api/airport-search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Failed to fetch airports');
      return response.json();
    },
    enabled: searchQuery.length >= 2,
    refetchOnWindowFocus: false
  });

  // Reset search query when popover closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
    }
  }, [open]);

  const handleAirportSelect = (airport: Airport, city: City) => {
    const displayText = `${airport.name}${airport.code ? ` (${airport.code})` : ''} – ${city.name}, ${city.countryName}`;
    onChange({
      airportId: airport.id,
      cityId: city.id,
      displayText
    });
    setOpen(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between pl-9 relative text-left font-normal"
            disabled={disabled}
          >
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
            <span className="truncate">
              {value.displayText || placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[350px]" align="start">
          <Command>
            <CommandInput 
              placeholder={t('search.cityOrAirport', 'Search city or airport...')} 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>
                {searchQuery.length < 2 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    {t('search.typeAtLeast2Chars', 'Type at least 2 characters to search...')}
                  </p>
                ) : isLoading ? (
                  <div className="py-6 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">{t('search.searchingAirports', 'Searching airports...')}</p>
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    {t('search.noAirportsFound', 'No airports found')}
                  </p>
                )}
              </CommandEmpty>
              {airportGroups.length > 0 && (
                <>
                  {airportGroups.map((group) => (
                    <CommandGroup key={`city-${group.city.id}`} heading={`${group.city.name}, ${group.city.countryName}`}>
                      {group.airports.map((airport) => (
                        <CommandItem
                          key={`airport-${airport.id}`}
                          value={`${airport.name}-${group.city.name}`}
                          onSelect={() => handleAirportSelect(airport, group.city)}
                          className="flex items-center justify-between"
                        >
                          <span>
                            {airport.name}
                            {airport.code && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                ({airport.code})
                              </span>
                            )}
                          </span>
                          {value.airportId === airport.id && (
                            <span className="text-primary">✓</span>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AirportSelector;