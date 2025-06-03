import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { ScrollArea } from "./scroll-area";
import { Badge } from "./badge";
import * as LucideIcons from "lucide-react";

// Common icon categories for travel and tourism
const iconCategories = {
  travel: [
    "Plane", "Car", "Bus", "Train", "Ship", "Bike", "Walk", "MapPin", "Map", "Navigation",
    "Compass", "Globe", "Earth", "Mountain", "TreePine", "Waves", "Sun", "Moon", "Star"
  ],
  accommodation: [
    "Hotel", "Home", "Building", "Castle", "Tent", "Warehouse", "Store", "Bed", "Bath",
    "Wifi", "AirVent", "Coffee", "Utensils", "Wine", "Music", "Tv", "Gamepad2"
  ],
  activities: [
    "Camera", "Image", "Video", "Binoculars", "Telescope", "Footprints", "Trophy", "Award",
    "Target", "Zap", "Heart", "ThumbsUp", "Gift", "ShoppingBag", "CreditCard", "Ticket"
  ],
  services: [
    "Shield", "Lock", "Phone", "Mail", "MessageCircle", "Calendar", "Clock", "Timer",
    "Users", "User", "Crown", "Key", "Tool", "Settings", "Info", "AlertCircle", "CheckCircle"
  ],
  food: [
    "UtensilsCrossed", "ChefHat", "Cookie", "Cake", "Pizza", "Soup", "IceCream", "Cherry",
    "Apple", "Grape", "Sandwich", "Croissant", "Fish", "Beef", "Salad", "CupSoda"
  ],
  weather: [
    "Sun", "Moon", "Cloud", "CloudRain", "CloudSnow", "Zap", "Rainbow", "Snowflake",
    "Droplets", "Wind", "Thermometer", "Sunrise", "Sunset", "Eclipse"
  ]
};

interface IconSelectorProps {
  value?: string;
  onChange: (iconName: string) => void;
  placeholder?: string;
  className?: string;
}

export function IconSelector({ value, onChange, placeholder = "Select an icon", className }: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get all available icons
  const allIcons = Object.keys(LucideIcons).filter(name => 
    name !== 'default' && 
    name !== 'createLucideIcon' && 
    typeof (LucideIcons as any)[name] === 'function'
  );

  // Filter icons based on search and category
  const filteredIcons = allIcons.filter(iconName => {
    const matchesSearch = iconName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || 
      iconCategories[selectedCategory as keyof typeof iconCategories]?.includes(iconName);
    return matchesSearch && matchesCategory;
  });

  const handleIconSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  const selectedIcon = value ? renderIcon(value) : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start ${className}`}
          type="button"
        >
          <div className="flex items-center gap-2">
            {selectedIcon || <div className="w-5 h-5" />}
            <span className="flex-1 text-left">
              {value || placeholder}
            </span>
          </div>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select an Icon</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <Input
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {Object.keys(iconCategories).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
          
          {/* Icons Grid */}
          <ScrollArea className="h-64">
            <div className="grid grid-cols-8 gap-2 p-2">
              {filteredIcons.slice(0, 100).map((iconName) => (
                <Button
                  key={iconName}
                  variant={value === iconName ? "default" : "ghost"}
                  size="sm"
                  className="h-12 w-12 p-2"
                  onClick={() => handleIconSelect(iconName)}
                  title={iconName}
                >
                  {renderIcon(iconName)}
                </Button>
              ))}
            </div>
          </ScrollArea>
          
          {/* Selected Icon Info */}
          {value && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              {selectedIcon}
              <span className="text-sm font-medium">{value}</span>
              <Badge variant="secondary" className="ml-auto">Selected</Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}