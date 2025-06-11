import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  Users, 
  Map, 
  Building, 
  Bed, 
  Package, 
  Settings,
  User,
  Car,
  MapPin,
  Clock,
  Tag,
  Menu,
  Globe as GlobeIcon,
  Languages,
  Type,
  ChevronDown,
  Plus,
  List,
  Star,
  ShieldCheck,
  Database,
  FileCheck,
  ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLanguage } from "@/hooks/use-language";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  location: string;
}

export function Sidebar({ collapsed, onToggle, location }: SidebarProps) {
  const { t } = useLanguage();
  
  // Auto-expand the relevant menu based on the current location
  const initialExpandedState = {
    tours: location?.includes('/admin/tours') || false,
    packages: location?.includes('/admin/packages') || false,
    hotels: location?.includes('/admin/hotels') || false,
    rooms: location?.includes('/admin/rooms') || false
  };
  
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(initialExpandedState);
  
  // Update expanded menus when location changes
  useEffect(() => {
    // Check if the current location matches any of our menus
    const newExpandedState = {
      tours: location?.includes('/admin/tours') || false,
      packages: location?.includes('/admin/packages') || false,
      hotels: location?.includes('/admin/hotels') || false,
      rooms: location?.includes('/admin/rooms') || false
    };
    
    setExpandedMenus(newExpandedState);
  }, [location]);
  
  // Handle menu expansion
  const toggleSubmenu = (menuKey: string) => {
    if (collapsed) return; // Don't toggle when sidebar is collapsed
    
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };
  
  // Define sidebar menu items
  const menuItems = [
    { 
      icon: <LayoutDashboard size={20} />, 
      label: t('admin.sidebar.dashboard', 'Dashboard'), 
      href: "/admin" 
    },
    { 
      icon: <Users size={20} />, 
      label: t('admin.sidebar.userManagement', 'User Management'), 
      href: "/admin/users" 
    },
    { 
      icon: <ImageIcon size={20} />, 
      label: t('admin.sidebar.heroSlider', 'Hero Slider'), 
      href: "/admin/slider" 
    },
    { 
      icon: <GlobeIcon size={20} />, 
      label: t('admin.sidebar.countriesCities', 'Countries & Cities'), 
      href: "/admin/countries-cities" 
    },
    { 
      icon: <MapPin size={20} />, 
      label: t('admin.sidebar.destinations', 'Destinations'), 
      href: "/admin/destinations" 
    },
    { 
      icon: <Map size={20} />, 
      label: t('admin.sidebar.tours', 'Tours'), 
      href: "/admin/tours",
      hasSubmenu: true,
      menuKey: "tours",
      isExpanded: expandedMenus.tours,
      toggle: () => toggleSubmenu("tours"),
      submenuItems: [
        { 
          icon: <List size={16} />, 
          label: t('admin.sidebar.allTours', 'All Tours'), 
          href: "/admin/tours" 
        },
        { 
          icon: <Plus size={16} />, 
          label: t('admin.sidebar.createTour', 'Create Tour'), 
          href: "/admin/tours/create" 
        },
        { 
          icon: <Star size={16} />, 
          label: t('admin.sidebar.featuredTours', 'Featured Tours'), 
          href: "/admin/tours?filter=featured" 
        },
        { 
          icon: <Tag size={16} />, 
          label: t('admin.sidebar.tourCategories', 'Category Manager'), 
          href: "/admin/tours/categories" 
        },
      ]
    },
    { 
      icon: <Building size={20} />, 
      label: t('admin.sidebar.hotels', 'Hotels'), 
      href: "/admin/hotels",
      hasSubmenu: true,
      menuKey: "hotels",
      isExpanded: expandedMenus.hotels,
      toggle: () => toggleSubmenu("hotels"),
      submenuItems: [
        { 
          icon: <List size={16} />, 
          label: t('admin.sidebar.allHotels', 'All Hotels'), 
          href: "/admin/hotels" 
        },
        { 
          icon: <Plus size={16} />, 
          label: t('admin.sidebar.addHotel', 'Add Hotel'), 
          href: "/admin/hotels/create" 
        },
        { 
          icon: <Star size={16} />, 
          label: t('admin.sidebar.featuredHotels', 'Featured Hotels'), 
          href: "/admin/hotels?filter=featured" 
        },
        { 
          icon: <Tag size={16} />, 
          label: t('admin.sidebar.hotelCategories', 'Category Manager'), 
          href: "/admin/hotels/categories" 
        },
        { 
          icon: <Building size={16} />, 
          label: t('admin.sidebar.hotelFacilities', 'Facilities Manager'), 
          href: "/admin/hotels/facilities" 
        },
        { 
          icon: <Star size={16} />, 
          label: t('admin.sidebar.hotelHighlights', 'Highlights Manager'), 
          href: "/admin/hotels/highlights" 
        },
        { 
          icon: <ShieldCheck size={16} />, 
          label: t('admin.sidebar.cleanlinessFeatures', 'Cleanliness Features'), 
          href: "/admin/hotels/cleanliness-features" 
        },
      ]
    },
    { 
      icon: <Bed size={20} />, 
      label: t('admin.sidebar.rooms', 'Rooms'), 
      href: "/admin/rooms",
      hasSubmenu: true,
      menuKey: "rooms",
      isExpanded: expandedMenus.rooms,
      toggle: () => toggleSubmenu("rooms"),
      submenuItems: [
        { 
          icon: <List size={16} />, 
          label: t('admin.sidebar.allRooms', 'All Rooms'), 
          href: "/admin/rooms" 
        },
        { 
          icon: <Plus size={16} />, 
          label: t('admin.sidebar.addRoom', 'Add Room'), 
          href: "/admin/rooms/create" 
        },
        { 
          icon: <Star size={16} />, 
          label: t('admin.sidebar.standardRooms', 'Standard Rooms'), 
          href: "/admin/rooms?filter=standard" 
        },
        { 
          icon: <Star size={16} />, 
          label: t('admin.sidebar.deluxeRooms', 'Deluxe Rooms'), 
          href: "/admin/rooms?filter=deluxe" 
        },
        { 
          icon: <Tag size={16} />, 
          label: t('admin.sidebar.roomCategories', 'Category Manager'), 
          href: "/admin/rooms/categories" 
        },
        { 
          icon: <Settings size={16} />, 
          label: t('admin.sidebar.roomAmenities', 'Room Amenities'), 
          href: "/admin/rooms/amenities" 
        },
      ]
    },
    { 
      icon: <Package size={20} />, 
      label: t('admin.sidebar.packages', 'Packages'), 
      href: "/admin/packages",
      hasSubmenu: true,
      menuKey: "packages",
      isExpanded: expandedMenus.packages,
      toggle: () => toggleSubmenu("packages"),
      submenuItems: [
        { 
          icon: <List size={16} />, 
          label: t('admin.sidebar.allPackages', 'All Packages'), 
          href: "/admin/packages" 
        },
        { 
          icon: <Plus size={16} />, 
          label: t('admin.sidebar.createPackage', 'Create Package'), 
          href: "/admin/packages/create" 
        },
        { 
          icon: <Plus size={16} />, 
          label: t('admin.sidebar.createManual', 'Create Manual'), 
          href: "/admin/packages/create-manual" 
        },
        { 
          icon: <Star size={16} />, 
          label: t('admin.sidebar.featuredPackages', 'Featured Packages'), 
          href: "/admin/packages?filter=featured" 
        },
        { 
          icon: <Tag size={16} />, 
          label: t('admin.sidebar.packageCategories', 'Category Manager'), 
          href: "/admin/packages/categories" 
        },
      ]
    },
    { 
      icon: <Car size={20} />, 
      label: t('admin.sidebar.transportation', 'Transportation'), 
      href: "/admin/transportation" 
    },
    { 
      icon: <Tag size={20} />, 
      label: t('admin.sidebar.vehicleTypes', 'Vehicle Types'), 
      href: "/admin/transport-types" 
    },
    { 
      icon: <MapPin size={20} />, 
      label: t('admin.sidebar.locations', 'Locations'), 
      href: "/admin/transport-locations" 
    },
    { 
      icon: <Clock size={20} />, 
      label: t('admin.sidebar.durations', 'Durations'), 
      href: "/admin/transport-durations" 
    },
    { 
      icon: <Menu size={20} />, 
      label: t('admin.sidebar.menuManager', 'Menu Manager'), 
      href: "/admin/menus" 
    },
    { 
      icon: <Languages size={20} />, 
      label: t('admin.sidebar.translations', 'Translations'), 
      href: "/admin/translations" 
    },
    { 
      icon: <FileCheck size={20} />, 
      label: t('admin.sidebar.visaManagement', 'Visa Management'), 
      href: "/admin/visas",
      hasSubmenu: true,
      menuKey: "visas",
      isExpanded: location?.includes('/admin/visas') || false,
      toggle: () => toggleSubmenu("visas"),
      submenuItems: [
        { 
          icon: <List size={16} />, 
          label: t('admin.sidebar.allVisas', 'All Visas'), 
          href: "/admin/visas" 
        },
        { 
          icon: <GlobeIcon size={16} />, 
          label: t('admin.sidebar.nationalityRequirements', 'Nationality Requirements'), 
          href: "/admin/visas?tab=requirements" 
        },
        { 
          icon: <Tag size={16} />, 
          label: t('admin.sidebar.nationalities', 'Nationalities'), 
          href: "/admin/visas?tab=nationalities" 
        },
      ]
    },
    { 
      icon: <Database size={20} />, 
      label: t('admin.sidebar.dataExportImport', 'Data Export/Import'), 
      href: "/admin/data-export-import" 
    },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-20 h-screen bg-white border-r transition-all duration-300 flex flex-col",
        collapsed ? "w-[80px]" : "w-[250px]"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b">
        {!collapsed && (
          <div className="text-xl font-semibold text-primary">
            Egypt Express
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto" 
          onClick={onToggle}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      
      {/* User profile section */}
      <div className={cn("p-4 flex items-center gap-3", collapsed && "justify-center")}>
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>
            <User size={20} />
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div>
            <div className="font-medium">Admin User</div>
            <div className="text-xs text-zinc-500">Administrator</div>
          </div>
        )}
      </div>
      
      <Separator />
      
      {/* Navigation Menu */}
      <nav className="h-[calc(100vh-120px)] py-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              {item.hasSubmenu ? (
                <Collapsible
                  open={!collapsed && item.isExpanded}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild onClick={item.toggle}>
                    <div
                      className={cn(
                        "flex items-center justify-between w-full px-4 py-3 text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer",
                        location?.startsWith(item.href) && "bg-zinc-100 text-primary font-medium",
                        collapsed ? "justify-center" : ""
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-current">{item.icon}</span>
                        {!collapsed && <span>{item.label}</span>}
                      </div>
                      {!collapsed && (
                        <ChevronDown 
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            item.isExpanded ? "rotate-180" : ""
                          )} 
                        />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    {!collapsed && (
                      <ul className="pl-8 mt-1 space-y-1">
                        {item.submenuItems?.map((subItem) => (
                          <li key={subItem.href}>
                            <Link href={subItem.href}>
                              <div
                                className={cn(
                                  "flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors",
                                  location === subItem.href && "bg-zinc-100 text-primary font-medium"
                                )}
                              >
                                <span className="text-current">{subItem.icon}</span>
                                <span>{subItem.label}</span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <div className="block w-full">
                  <Link href={item.href}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-100 transition-colors",
                        location === item.href && "bg-zinc-100 text-primary font-medium",
                        collapsed ? "justify-center" : ""
                      )}
                    >
                      <span className="text-current">{item.icon}</span>
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <Link href="/admin/settings">
          <Button 
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            className={cn(
              "w-full flex items-center gap-2", 
              collapsed && "justify-center",
              location === "/admin/settings" && "bg-zinc-100 text-primary font-medium"
            )}
          >
            <Settings size={20} />
            {!collapsed && <span>{t('admin.sidebar.settings', 'Settings')}</span>}
          </Button>
        </Link>
      </div>
    </aside>
  );
}