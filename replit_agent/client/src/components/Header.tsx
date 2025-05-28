import React from "react";
import { Link, useLocation } from "wouter";
import logo from "../assets/EgyptExpressTvl-logo.png";
import { Button } from "@/components/ui/button";
import {
  UmbrellaIcon,
  UserCircleIcon,
  MenuIcon,
  MapPinIcon,
  LogOut,
  Heart,
  User,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [expandedMobileMenus, setExpandedMobileMenus] = React.useState<Record<string, boolean>>({
    tours: false,
    packages: false,
    hotels: false,
    rooms: false
  });
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { t, isRTL } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMobileSubmenu = (menuName: string) => {
    setExpandedMobileMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.fullName) {
      return user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return user?.username.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-primary flex items-center"
          >
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>

        <nav className="hidden md:block">
          <ul className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-6`}>
            <li>
              <Link
                href="/"
                className={`font-medium hover:text-primary transition-colors ${location === "/" ? "text-primary" : ""}`}
              >
                {t('nav.home', 'Home')}
              </Link>
            </li>
            <li>
              <Link
                href="/destinations"
                className={`font-medium hover:text-primary transition-colors ${location === "/destinations" ? "text-primary" : ""}`}
              >
                {t('nav.destinations', 'Destinations')}
              </Link>
            </li>
            <li>
              <Link
                href="/packages"
                className={`font-medium hover:text-primary transition-colors ${location.startsWith("/packages") ? "text-primary" : ""}`}
              >
                {t('nav.packages', 'Packages')}
              </Link>
            </li>
            <li>
              <Link
                href="/visa"
                className={`font-medium hover:text-primary transition-colors ${location.startsWith("/visa") ? "text-primary" : ""}`}
              >
                {t('nav.visa', 'Visa')}
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`font-medium hover:text-primary transition-colors ${location === "/about" ? "text-primary" : ""}`}
              >
                {t('nav.about', 'About Us')}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`font-medium hover:text-primary transition-colors ${location === "/contact" ? "text-primary" : ""}`}
              >
                {t('nav.contact', 'Contact Us')}
              </Link>
            </li>
          </ul>
        </nav>

        <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4`}>
          <LanguageSwitcher />
          
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.avatarUrl || ""}
                        alt={user.username}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">
                      {user.fullName || user.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                      <span>{t('nav.profile', 'Profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/destinations?filter=favorites"
                      className="cursor-pointer"
                    >
                      <Heart className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                      <span>{t('nav.favorites', 'Favorites')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin"
                      className="cursor-pointer"
                    >
                      <UmbrellaIcon className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                      <span>{t('nav.admin', 'Admin Dashboard')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    <span>{t('nav.signout', 'Log out')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link
              href="/auth"
              className="hidden md:inline-flex items-center font-medium hover:text-primary transition-colors"
            >
              <UserCircleIcon className={`${isRTL ? 'ml-1' : 'mr-1'}`} size={18} />
              {t('nav.signin', 'Sign In')}
            </Link>
          )}

          <Button className="bg-primary hover:bg-primary/90 text-white rounded-md shadow-sm">
            <MapPinIcon className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
            {t('nav.booknow', 'Book Now')}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-neutral-700"
            onClick={toggleMenu}
          >
            <MenuIcon className="text-xl" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-3 bg-white border-t">
          <ul className="space-y-3">
            <li>
              <Link
                href="/"
                className={`block font-medium hover:text-primary transition-colors ${location === "/" ? "text-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home', 'Home')}
              </Link>
            </li>
            
            <li>
              <Link
                href="/destinations"
                className={`block font-medium hover:text-primary transition-colors ${location === "/destinations" ? "text-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.destinations', 'Destinations')}
              </Link>
            </li>
            
            <li>
              <Link
                href="/packages"
                className={`block font-medium hover:text-primary transition-colors ${location.startsWith("/packages") ? "text-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.packages', 'Packages')}
              </Link>
            </li>
            
            <li>
              <Link
                href="/visa"
                className={`block font-medium hover:text-primary transition-colors ${location.startsWith("/visa") ? "text-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.visa', 'Visa')}
              </Link>
            </li>
            
            <li>
              <Link
                href="/about"
                className={`block font-medium hover:text-primary transition-colors ${location === "/about" ? "text-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.about', 'About Us')}
              </Link>
            </li>
            
            <li>
              <Link
                href="/contact"
                className={`block font-medium hover:text-primary transition-colors ${location === "/contact" ? "text-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.contact', 'Contact Us')}
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link
                    href="/profile"
                    className="block font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className={`inline ${isRTL ? 'ml-1' : 'mr-1'} h-4 w-4`} />
                    {t('nav.profile', 'Profile')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/destinations?filter=favorites"
                    className="block font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className={`inline ${isRTL ? 'ml-1' : 'mr-1'} h-4 w-4`} />
                    {t('nav.favorites', 'Favorites')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin"
                    className="block font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UmbrellaIcon className={`inline ${isRTL ? 'ml-1' : 'mr-1'} h-4 w-4`} />
                    {t('nav.admin', 'Admin Dashboard')}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left font-medium text-destructive hover:text-destructive/90 transition-colors"
                  >
                    <LogOut className={`inline ${isRTL ? 'ml-1' : 'mr-1'} h-4 w-4`} />
                    {t('nav.signout', 'Log Out')}
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/auth"
                  className="block font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircleIcon className={`inline ${isRTL ? 'ml-1' : 'mr-1'}`} size={18} />
                  {t('nav.signin', 'Sign In')}
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
