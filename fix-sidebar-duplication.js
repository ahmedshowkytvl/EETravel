#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of admin pages that need fixing
const adminPages = [
  'client/src/pages/admin/rooms/categories.tsx',
  'client/src/pages/admin/Dashboard.tsx',
  'client/src/pages/admin/PackagesManagement.tsx',
  'client/src/pages/admin/HotelsManagement.tsx',
  'client/src/pages/admin/RoomsManagement.tsx',
  'client/src/pages/admin/UsersManagement.tsx',
  'client/src/pages/admin/DestinationsManagement.tsx',
  'client/src/pages/admin/CountryCityManagement.tsx',
  'client/src/pages/admin/DataExportImportPage.tsx',
  'client/src/pages/admin/MenuManager.tsx',
  'client/src/pages/admin/SettingsPage.tsx',
  'client/src/pages/admin/TranslationManagement.tsx',
  'client/src/pages/admin/TransportTypesManagement.tsx',
  'client/src/pages/admin/TransportLocationsManagement.tsx',
  'client/src/pages/admin/TransportDurationsManagement.tsx'
];

function fixAdminPage(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove DashboardLayout import
  content = content.replace(/import\s+{\s*DashboardLayout\s*}\s+from\s+["'][^"']*["'];\s*\n?/g, '');
  
  // Remove DashboardLayout wrapper - simple case
  content = content.replace(
    /return\s*\(\s*<DashboardLayout[^>]*>\s*([\s\S]*?)\s*<\/DashboardLayout>\s*\);/g,
    'return (\n    $1\n  );'
  );
  
  // Remove DashboardLayout wrapper - with location prop
  content = content.replace(
    /return\s*\(\s*<DashboardLayout\s+location={[^}]*}>\s*([\s\S]*?)\s*<\/DashboardLayout>\s*\);/g,
    'return (\n    $1\n  );'
  );
  
  // Handle conditional returns with DashboardLayout
  content = content.replace(
    /<DashboardLayout[^>]*>\s*([\s\S]*?)\s*<\/DashboardLayout>/g,
    '$1'
  );

  fs.writeFileSync(filePath, content);
  console.log(`Fixed: ${filePath}`);
}

// Fix all admin pages
adminPages.forEach(fixAdminPage);
console.log('Sidebar duplication fix completed!');