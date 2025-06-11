import fs from 'fs';
import path from 'path';

// Arabic text to translation key mappings
const translations = {
  // Dashboard
  'لوحة التحكم المتقدمة': 't("admin.advanced_dashboard", "Advanced Dashboard")',
  'نظرة شاملة على منصة رحلات الصحراء': 't("admin.dashboard_overview", "Comprehensive overview of Sahara Journeys platform")',
  'البحث في النظام...': 't("admin.search_system", "Search in system...")',
  'تصدير البيانات': 't("admin.export_data", "Export Data")',
  'تحذير النظام': 't("admin.system_warning", "System Warning")',
  'يوجد مشاكل في الأداء تحتاج إلى مراجعة': 't("admin.performance_issues", "Performance issues need attention")',
  'عرض التفاصيل': 't("admin.view_details", "View Details")',
  
  // Quick Actions
  'إضافة جولة': 't("admin.add_tour", "Add Tour")',
  'إضافة فندق': 't("admin.add_hotel", "Add Hotel")',
  'إضافة باقة': 't("admin.add_package", "Add Package")',
  'إدارة المستخدمين': 't("admin.manage_users", "Manage Users")',
  'إدارة الوجهات': 't("admin.manage_destinations", "Manage Destinations")',
  'إعدادات النظام': 't("admin.system_settings", "System Settings")',
  
  // Metrics
  'إجمالي المستخدمين': 't("admin.total_users", "Total Users")',
  'إجمالي الحجوزات': 't("admin.total_bookings", "Total Bookings")',
  'إجمالي الإيرادات': 't("admin.total_revenue", "Total Revenue")',
  'الباقات النشطة': 't("admin.active_packages", "Active Packages")',
  
  // Changes
  '+12% من الشهر الماضي': 't("admin.users_change", "+12% from last month")',
  '+8% من الشهر الماضي': 't("admin.bookings_change", "+8% from last month")',
  '+15% من الشهر الماضي': 't("admin.revenue_change", "+15% from last month")',
  '+5% من الشهر الماضي': 't("admin.packages_change", "+5% from last month")',
  
  // Bookings Management
  'إدارة الحجوزات المتقدمة': 't("admin.advanced_bookings", "Advanced Bookings Management")',
  'إدارة شاملة لجميع الحجوزات مع إمكانيات متقدمة': 't("admin.bookings_description", "Comprehensive management of all bookings with advanced capabilities")',
  'الحجوزات المؤكدة': 't("admin.confirmed_bookings", "Confirmed Bookings")',
  'الحجوزات المعلقة': 't("admin.pending_bookings", "Pending Bookings")',
  'الحجوزات المرفوضة': 't("admin.cancelled_bookings", "Cancelled Bookings")',
  'البحث في الحجوزات...': 't("admin.search_bookings", "Search bookings...")',
  'تصفية حسب الحالة': 't("admin.filter_by_status", "Filter by Status")',
  'جميع الحالات': 't("admin.all_statuses", "All Statuses")',
  'مؤكد': 't("admin.confirmed", "Confirmed")',
  'معلق': 't("admin.pending", "Pending")',
  'ملغي': 't("admin.cancelled", "Cancelled")',
  'مرفوض': 't("admin.rejected", "Rejected")',
  
  // User Management
  'إدارة المستخدمين المتقدمة': 't("admin.advanced_users", "Advanced User Management")',
  'إدارة شاملة للمستخدمين مع التحكم في الأدوار': 't("admin.users_description", "Comprehensive user management with role-based controls")',
  'المستخدمون النشطون': 't("admin.active_users", "Active Users")',
  'المشرفون': 't("admin.admin_users", "Admin Users")',
  'المستخدمون المميزون': 't("admin.vip_users", "VIP Users")',
  'إضافة مستخدم جديد': 't("admin.add_new_user", "Add New User")',
  
  // System Settings
  'إعدادات النظام المتقدمة': 't("admin.advanced_settings", "Advanced System Settings")',
  'تكوين شامل لجميع جوانب النظام': 't("admin.settings_description", "Comprehensive configuration for all system aspects")',
  'الإعدادات العامة': 't("admin.general_settings", "General Settings")',
  'إعدادات البريد الإلكتروني': 't("admin.email_settings", "Email Settings")',
  'إعدادات الدفع': 't("admin.payment_settings", "Payment Settings")',
  'إعدادات الأمان': 't("admin.security_settings", "Security Settings")',
  'النسخ الاحتياطية': 't("admin.backups", "Backups")',
  'مراقبة النظام': 't("admin.system_monitoring", "System Monitoring")',
  
  // Common Actions
  'حفظ التغييرات': 't("admin.save_changes", "Save Changes")',
  'إلغاء': 't("admin.cancel", "Cancel")',
  'تأكيد': 't("admin.confirm", "Confirm")',
  'حذف': 't("admin.delete", "Delete")',
  'تعديل': 't("admin.edit", "Edit")',
  'عرض': 't("admin.view", "View")',
  'إضافة': 't("admin.add", "Add")',
  'بحث': 't("admin.search", "Search")',
  'تصفية': 't("admin.filter", "Filter")',
  'تصدير': 't("admin.export", "Export")',
  'استيراد': 't("admin.import", "Import")',
  
  // Status messages
  'تم الحفظ بنجاح': 't("admin.saved_successfully", "Saved successfully")',
  'تم الحذف بنجاح': 't("admin.deleted_successfully", "Deleted successfully")',
  'تم التحديث بنجاح': 't("admin.updated_successfully", "Updated successfully")',
  'تم إنشاء العنصر بنجاح': 't("admin.created_successfully", "Created successfully")',
  'حدث خطأ': 't("admin.error_occurred", "An error occurred")',
  'تم تصدير البيانات بنجاح': 't("admin.export_success", "Data exported successfully")',
};

// Function to replace Arabic text in a file
function replaceArabicText(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Add useLanguage import if not present
    if (content.includes('from "@/hooks/use-language"') === false && 
        content.includes('import') && 
        (content.includes('إجمالي') || content.includes('إضافة') || content.includes('إدارة') || 
         content.includes('تصدير') || content.includes('البحث') || content.includes('عرض'))) {
      
      // Find the last import statement
      const importRegex = /import[^;]+;/g;
      const imports = content.match(importRegex);
      if (imports && imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        const insertIndex = lastImportIndex + lastImport.length;
        
        content = content.slice(0, insertIndex) + 
                 '\nimport { useLanguage } from "@/hooks/use-language";' + 
                 content.slice(insertIndex);
        modified = true;
      }
    }
    
    // Add useLanguage hook if component doesn't have it
    const componentStart = content.indexOf('export default function');
    if (componentStart !== -1 && !content.includes('const { t } = useLanguage();')) {
      const functionBodyStart = content.indexOf('{', componentStart);
      if (functionBodyStart !== -1) {
        const insertIndex = functionBodyStart + 1;
        content = content.slice(0, insertIndex) + 
                 '\n  const { t } = useLanguage();' + 
                 content.slice(insertIndex);
        modified = true;
      }
    }
    
    // Replace Arabic text with translation keys
    for (const [arabic, translation] of Object.entries(translations)) {
      const regex = new RegExp(arabic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (content.includes(arabic)) {
        content = content.replace(regex, translation);
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Process all admin files
const adminDir = './client/src/pages/admin';
const files = fs.readdirSync(adminDir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(adminDir, file);
    replaceArabicText(filePath);
  }
});

console.log('Finished processing admin files');