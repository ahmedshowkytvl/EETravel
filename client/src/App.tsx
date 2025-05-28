import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { LanguageProvider } from "@/hooks/use-language";
import { ProtectedRoute } from "@/lib/protected-route";
import { AdminRoute } from "@/lib/admin-route";
import { NavigationProvider, useNavigation } from "@/contexts/NavigationContext";
import Preloader from "@/components/Preloader";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AuthPage from "@/pages/auth-page";
import DestinationsPage from "@/pages/destinations-page";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import ProfilePage from "@/pages/profile-page";
import SocialMediaBoxDemo from "@/pages/SocialMediaBoxDemo";
import SailingCruise from "@/pages/sailing-cruise";
import ZigzagDemo from "@/pages/ZigzagDemo";
import PackageDetail from "@/pages/package-detail";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";

// Search Results Pages
import {
  FlightsSearchResults,
  HotelsSearchResults,
  TransportationSearchResults,
  VisasSearchResults,
  ToursSearchResults,
  PackagesSearchResults
} from "@/pages/search-results";

// Admin Pages
import PackagesManagement from "@/pages/admin/PackagesManagement";
import PackageCreatorPage from "@/pages/admin/PackageCreatorPage";
import CreateManualPackage from "@/pages/admin/CreateManualPackage";
import UsersManagement from "@/pages/admin/UsersManagement";
import ToursManagement from "@/pages/admin/ToursManagement";
import TourCreatorPage from "@/pages/admin/TourCreatorPage";
import HotelsManagement from "@/pages/admin/HotelsManagement";
import AdvancedHotelsManagement from "@/pages/admin/AdvancedHotelsManagement";
import HotelCreatePage from "@/pages/admin/HotelCreatePage";
import HotelEditPage from "@/pages/admin/HotelEditPage";
import EnhancedHotelCreatePage from "@/pages/admin/EnhancedHotelCreatePage";
import EnhancedHotelEditPage from "@/pages/admin/EnhancedHotelEditPage";
import RoomsManagement from "@/pages/admin/RoomsManagement";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AnalyticsDashboard from "@/pages/admin/AnalyticsDashboard";
import SystemMonitoring from "@/pages/admin/SystemMonitoring";
import EnhancedDataImportPage from "@/pages/admin/EnhancedDataImportPage";
import RoomsPage from "@/pages/admin/RoomsPage";
import RoomCreatePage from "@/pages/admin/RoomCreatePage";
import TransportationManagement from "@/pages/admin/TransportationManagement";
import TransportationCreate from "@/pages/admin/TransportationCreate";
import TransportationEdit from "@/pages/admin/TransportationEdit";
import TransportTypesManagement from "@/pages/admin/TransportTypesManagement";
import TransportLocationsManagement from "@/pages/admin/TransportLocationsManagement";
import TransportDurationsManagement from "@/pages/admin/TransportDurationsManagement";
import CountryCityManagement from "@/pages/admin/CountryCityManagement";
import DestinationsManagement from "@/pages/admin/DestinationsManagement";
import MenuManager from "@/pages/admin/MenuManager";
import SettingsPage from "@/pages/admin/SettingsPage";
import TranslationManagement from "@/pages/admin/TranslationManagement";
import Dashboard from "@/pages/admin/Dashboard";
import Layout from "@/components/Layout";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

// Import CSS
import "./styles/sailing-cruise.css";

// Import Category and Feature Manager Pages
import TourCategoriesPage from "@/pages/admin/tours/categories";
import HotelCategoriesPage from "@/pages/admin/hotels/categories";
import RoomCategoriesPage from "@/pages/admin/rooms/categories";
import RoomAmenitiesPage from "@/pages/admin/rooms/RoomAmenitiesPage";
import PackageCategoriesPage from "@/pages/admin/packages/categories";
import HotelFacilitiesPage from "@/pages/admin/hotels/HotelFacilitiesPage";
import HotelHighlightsPage from "@/pages/admin/hotels/HotelHighlightsPage";
import CleanlinessPage from "@/pages/admin/hotels/CleanlinessPage";
import DataExportImportPage from "@/pages/admin/DataExportImportPage";
import VisasManagement from "@/pages/admin/VisasManagement";

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  // Don't wrap admin routes with the regular Layout
  if (isAdminRoute) {
    // Log location before passing to DashboardLayout
    console.log("App.tsx location type:", typeof location);
    console.log("App.tsx location value:", location);
    return (
      <DashboardLayout location={location}>
        <Switch>
          <AdminRoute path="/admin/packages/create" component={PackageCreatorPage} />
          <AdminRoute path="/admin/packages/edit/:id" component={PackageCreatorPage} />
          <AdminRoute path="/admin/packages/create-manual" component={CreateManualPackage} />
          <AdminRoute path="/admin/packages/categories" component={PackageCategoriesPage} />
          <AdminRoute path="/admin/packages" component={PackagesManagement} />
          <AdminRoute path="/admin/users" component={UsersManagement} />
          <AdminRoute path="/admin/tours/create" component={TourCreatorPage} />
          <AdminRoute path="/admin/tours/edit/:id" component={TourCreatorPage} />
          <AdminRoute path="/admin/tours/categories" component={TourCategoriesPage} />
          <AdminRoute path="/admin/tours" component={ToursManagement} />
          <AdminRoute path="/admin/hotels/categories" component={HotelCategoriesPage} />
          <AdminRoute path="/admin/hotels/create" component={EnhancedHotelCreatePage} />
          <AdminRoute path="/admin/hotels/create-basic" component={HotelCreatePage} />
          <AdminRoute path="/admin/hotels/edit/:id" component={EnhancedHotelEditPage} />
          <AdminRoute path="/admin/hotels/facilities" component={HotelFacilitiesPage} />
          <AdminRoute path="/admin/hotels/highlights" component={HotelHighlightsPage} />
          <AdminRoute path="/admin/hotels/cleanliness-features" component={CleanlinessPage} />
          <AdminRoute path="/admin/hotels" component={AdvancedHotelsManagement} />
          <AdminRoute path="/admin/rooms/categories" component={RoomCategoriesPage} />
          <AdminRoute path="/admin/rooms/amenities" component={RoomAmenitiesPage} />
          <AdminRoute path="/admin/rooms/create" component={RoomCreatePage} />
          <AdminRoute path="/admin/rooms/:id/edit" component={RoomCreatePage} />
          <AdminRoute path="/admin/rooms" component={RoomsPage} />
          <AdminRoute path="/admin/transportation/create" component={TransportationCreate} />
          <AdminRoute path="/admin/transportation/edit/:id" component={TransportationEdit} />
          <AdminRoute path="/admin/transportation" component={TransportationManagement} />
          <AdminRoute path="/admin/transport-types" component={TransportTypesManagement} />
          <AdminRoute path="/admin/transport-locations" component={TransportLocationsManagement} />
          <AdminRoute path="/admin/transport-durations" component={TransportDurationsManagement} />
          <AdminRoute path="/admin/countries-cities" component={CountryCityManagement} />
          <AdminRoute path="/admin/destinations" component={DestinationsManagement} />
          <AdminRoute path="/admin/menus" component={MenuManager} />
          <AdminRoute path="/admin/translations" component={TranslationManagement} />
          <AdminRoute path="/admin/data-export-import" component={DataExportImportPage} />
          <AdminRoute path="/admin/enhanced-import" component={EnhancedDataImportPage} />
          <AdminRoute path="/admin/analytics" component={AnalyticsDashboard} />
          <AdminRoute path="/admin/system-monitoring" component={SystemMonitoring} />
          <AdminRoute path="/admin/settings" component={SettingsPage} />
          <AdminRoute path="/admin" component={AdminDashboard} />
          <AdminRoute path="/admin/visas" component={VisasManagement} />
          <Route component={NotFound} />
        </Switch>
      </DashboardLayout>
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/destinations" component={DestinationsPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/social-demo" component={SocialMediaBoxDemo} />
        <Route path="/sailing-cruise" component={SailingCruise} />
        <Route path="/zigzag-demo" component={ZigzagDemo} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        
        {/* Search Results Pages */}
        <Route path="/search/flights" component={FlightsSearchResults} />
        <Route path="/search/hotels" component={HotelsSearchResults} />
        <Route path="/search/transportation" component={TransportationSearchResults} />
        <Route path="/search/visas" component={VisasSearchResults} />
        <Route path="/search/tours" component={ToursSearchResults} />
        <Route path="/search/packages" component={PackagesSearchResults} />
        
        {/* Package detail page */}
        <Route path="/packages/:id" component={PackageDetail} />
        
        {/* Tour detail page */}
        <Route path="/tour/:id" component={() => {
          const TourDetailsPage = require("@/pages/tour-details/TourDetailsPage").default;
          return <TourDetailsPage />;
        }} />
        
        {/* Hotel detail page */}
        <Route path="/hotel/:id" component={() => {
          const HotelDetailsPage = require("@/pages/hotel-details/HotelDetailsPage").default;
          return <HotelDetailsPage />;
        }} />
        
        {/* Cart and Checkout pages */}
        <Route path="/cart" component={CartPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/order-confirmation" component={OrderConfirmationPage} />
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function AppWithPreloader() {
  const { isLoading } = useNavigation();
  
  return (
    <>
      <Preloader isVisible={isLoading} />
      <Router />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <NavigationProvider>
              <Toaster />
              <AppWithPreloader />
            </NavigationProvider>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
