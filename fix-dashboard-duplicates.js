import fs from 'fs';
import path from 'path';

// Function to remove DashboardLayout wrapper from a file
function fixDashboardLayoutDuplication(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove DashboardLayout import
  content = content.replace(/import\s+{\s*DashboardLayout\s*}\s+from\s+["']@\/components\/dashboard\/DashboardLayout["'];\s*\n?/g, '');
  
  // Replace opening DashboardLayout with div
  content = content.replace(/(\s+)<DashboardLayout>/g, '$1<div>');
  
  // Replace closing DashboardLayout with div
  content = content.replace(/(\s+)<\/DashboardLayout>/g, '$1</div>');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${filePath}`);
}

// List of admin files that need fixing
const adminFiles = [
  'client/src/pages/admin/hotels/cleanliness-features.tsx',
  'client/src/pages/admin/hotels/CleanlinessPage.tsx',
  'client/src/pages/admin/hotels/highlights.tsx',
  'client/src/pages/admin/hotels/HotelFacilitiesPage.tsx',
  'client/src/pages/admin/hotels/HotelHighlightsPage.tsx',
  'client/src/pages/admin/rooms/categories.tsx',
  'client/src/pages/admin/rooms/RoomAmenitiesPage.tsx',
  'client/src/pages/admin/TourCreatorPage.tsx',
  'client/src/pages/admin/AdminDashboard.tsx',
  'client/src/pages/admin/AdvancedHotelsManagement.tsx',
  'client/src/pages/admin/AnalyticsDashboard.tsx',
  'client/src/pages/admin/CreateManualPackage.tsx',
  'client/src/pages/admin/EnhancedDataImportPage.tsx',
  'client/src/pages/admin/EnhancedHotelCreatePage.tsx',
  'client/src/pages/admin/EnhancedHotelEditPage.tsx',
  'client/src/pages/admin/HotelCreatePage.tsx',
  'client/src/pages/admin/HotelEditPage.tsx',
  'client/src/pages/admin/HotelsManagement.tsx',
  'client/src/pages/admin/MenuManager.tsx',
  'client/src/pages/admin/PackageCreatorPage.tsx',
  'client/src/pages/admin/PackagesPage.tsx',
  'client/src/pages/admin/RoomCreatePage.tsx',
  'client/src/pages/admin/RoomsManagement.tsx',
  'client/src/pages/admin/RoomsPage.tsx',
  'client/src/pages/admin/SettingsPage.tsx',
  'client/src/pages/admin/SystemMonitoring.tsx',
  'client/src/pages/admin/TranslationManagement.tsx',
  'client/src/pages/admin/TransportationCreate.tsx',
  'client/src/pages/admin/TransportationEdit.tsx',
  'client/src/pages/admin/TransportationManagement.tsx',
  'client/src/pages/admin/TransportationManagementFixed.tsx',
  'client/src/pages/admin/TransportDurationsManagement.tsx',
  'client/src/pages/admin/TransportLocationsManagement.tsx',
  'client/src/pages/admin/TransportTypesManagement.tsx',
  'client/src/pages/admin/UsersManagement.tsx',
  'client/src/pages/admin/DestinationsManagement.tsx',
  'client/src/pages/admin/CountryCityManagement.tsx',
  'client/src/pages/admin/DataExportImportPage.tsx'
];

// Process all files
adminFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    fixDashboardLayoutDuplication(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('All admin files processed successfully!');