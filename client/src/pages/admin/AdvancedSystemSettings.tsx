import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, Database, Mail, Globe, Shield, Bell, 
  CreditCard, Upload, Download, RefreshCw, Save,
  Server, Lock, Key, AlertCircle, CheckCircle,
  Monitor, Cpu, HardDrive, Wifi, Users, Activity
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    defaultLanguage: string;
    defaultCurrency: string;
    timezone: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    emailVerificationRequired: boolean;
  };
  email: {
    provider: string;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    enabled: boolean;
  };
  payment: {
    stripeEnabled: boolean;
    stripePublicKey: string;
    stripeSecretKey: string;
    paypalEnabled: boolean;
    paypalClientId: string;
    paypalSecret: string;
    currency: string;
    taxRate: number;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    passwordMinLength: number;
    passwordRequireSpecial: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireUppercase: boolean;
  };
  backup: {
    autoBackupEnabled: boolean;
    backupFrequency: string;
    backupRetention: number;
    lastBackup: string;
    nextBackup: string;
  };
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  database: {
    status: string;
    connectionCount: number;
    responseTime: number;
  };
  server: {
    uptime: string;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
  };
  services: {
    name: string;
    status: 'online' | 'offline' | 'error';
    lastChecked: string;
  }[];
}

export default function AdvancedSystemSettings() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: systemSettings, isLoading } = useQuery<SystemSettings>({
    queryKey: ['/api/admin/settings'],
  });

  const { data: systemHealth } = useQuery<SystemHealth>({
    queryKey: ['/api/admin/system/health'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: backupHistory = [] } = useQuery({
    queryKey: ['/api/admin/backups/history'],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<SystemSettings>) => {
      return apiRequest('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(newSettings)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toast({ title: "تم حفظ الإعدادات بنجاح" });
    }
  });

  const testEmailMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/admin/settings/test-email', { method: 'POST' });
    },
    onSuccess: () => {
      toast({ title: "تم إرسال رسالة اختبار بنجاح" });
    }
  });

  const createBackupMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/admin/backups/create', { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/backups/history'] });
      toast({ title: "تم إنشاء نسخة احتياطية بنجاح" });
    }
  });

  const restoreBackupMutation = useMutation({
    mutationFn: async (backupId: string) => {
      return apiRequest(`/api/admin/backups/${backupId}/restore`, { method: 'POST' });
    },
    onSuccess: () => {
      toast({ title: "تم استرداد النسخة الاحتياطية بنجاح" });
    }
  });

  useEffect(() => {
    if (systemSettings) {
      setSettings(systemSettings);
    }
  }, [systemSettings]);

  const handleSaveSettings = () => {
    if (settings) {
      updateSettingsMutation.mutate(settings);
    }
  };

  const updateSetting = (section: keyof SystemSettings, key: string, value: any) => {
    if (settings) {
      setSettings({
        ...settings,
        [section]: {
          ...settings[section],
          [key]: value
        }
      });
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">t("admin.system_settings", "System Settings") المتقدمة</h1>
          <p className="text-gray-600 mt-1">إدارة شاملة لإعدادات وتكوين النظام</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleSaveSettings}
            disabled={updateSettingsMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            t("admin.save_changes", "Save Changes")
          </Button>
        </div>
      </div>

      {/* System Health Status */}
      <Card className={`border-2 ${
        systemHealth?.status === 'healthy' ? 'border-green-200 bg-green-50' :
        systemHealth?.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
        'border-red-200 bg-red-50'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                systemHealth?.status === 'healthy' ? 'bg-green-500' :
                systemHealth?.status === 'warning' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}>
                {systemHealth?.status === 'healthy' ? 
                  <CheckCircle className="w-6 h-6 text-white" /> :
                  <AlertCircle className="w-6 h-6 text-white" />
                }
              </div>
              <div>
                <h3 className="text-lg font-semibold">حالة النظام</h3>
                <p className="text-sm text-gray-600">
                  {systemHealth?.status === 'healthy' ? 'النظام يعمل بشكل طبيعي' :
                   systemHealth?.status === 'warning' ? 'توجد تحذيرات في النظام' :
                   'توجد مشاكل حرجة في النظام'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-6 text-center">
              <div>
                <div className="flex items-center gap-2 justify-center mb-1">
                  <Cpu className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">المعالج</span>
                </div>
                <div className="text-lg font-bold">{systemHealth?.server.cpuUsage}%</div>
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center mb-1">
                  <Monitor className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">الذاكرة</span>
                </div>
                <div className="text-lg font-bold">{systemHealth?.server.memoryUsage}%</div>
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center mb-1">
                  <HardDrive className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">القرص</span>
                </div>
                <div className="text-lg font-bold">{systemHealth?.server.diskUsage}%</div>
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center mb-1">
                  <Database className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">قاعدة البيانات</span>
                </div>
                <div className="text-lg font-bold">{systemHealth?.database.responseTime}ms</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            عام
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            البريد
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            الدفع
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            الأمان
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            t("admin.backups", "Backups")
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            المراقبة
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>t("admin.general_settings", "General Settings")</CardTitle>
              <CardDescription>إعدادات الموقع الأساسية والتكوين العام</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="siteName">اسم الموقع</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="defaultLanguage">اللغة الافتراضية</Label>
                  <Select 
                    value={settings.general.defaultLanguage}
                    onValueChange={(value) => updateSetting('general', 'defaultLanguage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="defaultCurrency">العملة الافتراضية</Label>
                  <Select 
                    value={settings.general.defaultCurrency}
                    onValueChange={(value) => updateSetting('general', 'defaultCurrency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                      <SelectItem value="EUR">يورو (EUR)</SelectItem>
                      <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                      <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">المنطقة الزمنية</Label>
                  <Select 
                    value={settings.general.timezone}
                    onValueChange={(value) => updateSetting('general', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Riyadh">الرياض</SelectItem>
                      <SelectItem value="Asia/Dubai">دبي</SelectItem>
                      <SelectItem value="Asia/Qatar">قطر</SelectItem>
                      <SelectItem value="Asia/Kuwait">الكويت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="siteDescription">وصف الموقع</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>وضع الصيانة</Label>
                    <p className="text-sm text-gray-600">تعطيل الموقع للصيانة</p>
                  </div>
                  <Switch 
                    checked={settings.general.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>السماح بالتسجيل</Label>
                    <p className="text-sm text-gray-600">السماح للمستخدمين الجدد بالتسجيل</p>
                  </div>
                  <Switch 
                    checked={settings.general.registrationEnabled}
                    onCheckedChange={(checked) => updateSetting('general', 'registrationEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t("admin.email_verification_required", "Email verification required")}</Label>
                    <p className="text-sm text-gray-600">{t("admin.users_must_confirm_email", "Users must confirm their email address")}</p>
                  </div>
                  <Switch 
                    checked={settings.general.emailVerificationRequired}
                    onCheckedChange={(checked) => updateSetting('general', 'emailVerificationRequired', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>t("admin.email_settings", "Email Settings")</CardTitle>
              <CardDescription>تكوين خدمة البريد الإلكتروني وSMTP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>تفعيل البريد الإلكتروني</Label>
                  <p className="text-sm text-gray-600">تشغيل أو إيقاف خدمة البريد الإلكتروني</p>
                </div>
                <Switch 
                  checked={settings.email.enabled}
                  onCheckedChange={(checked) => updateSetting('email', 'enabled', checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="smtpHost">خادم SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">منفذ SMTP</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                    placeholder="587"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpUser">اسم المستخدم</Label>
                  <Input
                    id="smtpUser"
                    value={settings.email.smtpUser}
                    onChange={(e) => updateSetting('email', 'smtpUser', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">كلمة المرور</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fromEmail">البريد المرسل</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fromName">اسم المرسل</Label>
                  <Input
                    id="fromName"
                    value={settings.email.fromName}
                    onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => testEmailMutation.mutate()}
                  disabled={testEmailMutation.isPending}
                  variant="outline"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  اختبار الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>t("admin.payment_settings", "Payment Settings")</CardTitle>
              <CardDescription>تكوين بوابات الدفع والعملات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Stripe</h3>
                    <Switch 
                      checked={settings.payment.stripeEnabled}
                      onCheckedChange={(checked) => updateSetting('payment', 'stripeEnabled', checked)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Public Key</Label>
                      <Input
                        value={settings.payment.stripePublicKey}
                        onChange={(e) => updateSetting('payment', 'stripePublicKey', e.target.value)}
                        placeholder="pk_live_..."
                      />
                    </div>
                    <div>
                      <Label>Secret Key</Label>
                      <Input
                        type="password"
                        value={settings.payment.stripeSecretKey}
                        onChange={(e) => updateSetting('payment', 'stripeSecretKey', e.target.value)}
                        placeholder="sk_live_..."
                      />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">PayPal</h3>
                    <Switch 
                      checked={settings.payment.paypalEnabled}
                      onCheckedChange={(checked) => updateSetting('payment', 'paypalEnabled', checked)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Client ID</Label>
                      <Input
                        value={settings.payment.paypalClientId}
                        onChange={(e) => updateSetting('payment', 'paypalClientId', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Secret</Label>
                      <Input
                        type="password"
                        value={settings.payment.paypalSecret}
                        onChange={(e) => updateSetting('payment', 'paypalSecret', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>العملة الافتراضية</Label>
                    <Select 
                      value={settings.payment.currency}
                      onValueChange={(value) => updateSetting('payment', 'currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="SAR">SAR</SelectItem>
                        <SelectItem value="AED">AED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>معدل الضريبة (%)</Label>
                    <Input
                      type="number"
                      value={settings.payment.taxRate}
                      onChange={(e) => updateSetting('payment', 'taxRate', parseFloat(e.target.value))}
                      placeholder="15"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>t("admin.security_settings", "Security Settings")</CardTitle>
              <CardDescription>تكوين الأمان وسياسات كلمات المرور</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>التحقق الثنائي</Label>
                    <p className="text-sm text-gray-600">تفعيل التحقق الثنائي للمديرين</p>
                  </div>
                  <Switch 
                    checked={settings.security.twoFactorEnabled}
                    onCheckedChange={(checked) => updateSetting('security', 'twoFactorEnabled', checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>مهلة الجلسة (دقيقة)</Label>
                  <Input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>محاولات تسجيل الدخول القصوى</Label>
                  <Input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>مدة الحظر (دقيقة)</Label>
                  <Input
                    type="number"
                    value={settings.security.lockoutDuration}
                    onChange={(e) => updateSetting('security', 'lockoutDuration', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>الحد الأدنى لطول كلمة المرور</Label>
                  <Input
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>يجب أن تحتوي كلمة المرور على رموز خاصة</Label>
                  </div>
                  <Switch 
                    checked={settings.security.passwordRequireSpecial}
                    onCheckedChange={(checked) => updateSetting('security', 'passwordRequireSpecial', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>يجب أن تحتوي كلمة المرور على أرقام</Label>
                  </div>
                  <Switch 
                    checked={settings.security.passwordRequireNumbers}
                    onCheckedChange={(checked) => updateSetting('security', 'passwordRequireNumbers', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>يجب أن تحتوي كلمة المرور على أحرف كبيرة</Label>
                  </div>
                  <Switch 
                    checked={settings.security.passwordRequireUppercase}
                    onCheckedChange={(checked) => updateSetting('security', 'passwordRequireUppercase', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>إدارة t("admin.backups", "Backups")</CardTitle>
              <CardDescription>تكوين وإدارة t("admin.backups", "Backups") للنظام</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>النسخ الاحتياطي التلقائي</Label>
                  <p className="text-sm text-gray-600">إنشاء نسخ احتياطية تلقائية</p>
                </div>
                <Switch 
                  checked={settings.backup.autoBackupEnabled}
                  onCheckedChange={(checked) => updateSetting('backup', 'autoBackupEnabled', checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>تكرار t("admin.backups", "Backups")</Label>
                  <Select 
                    value={settings.backup.backupFrequency}
                    onValueChange={(value) => updateSetting('backup', 'backupFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">يوميًا</SelectItem>
                      <SelectItem value="weekly">أسبوعيًا</SelectItem>
                      <SelectItem value="monthly">شهريًا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>الاحتفاظ بالنسخ (أيام)</Label>
                  <Input
                    type="number"
                    value={settings.backup.backupRetention}
                    onChange={(e) => updateSetting('backup', 'backupRetention', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">معلومات t("admin.backups", "Backups")</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">آخر نسخة احتياطية:</span>
                    <div className="font-medium">{settings.backup.lastBackup || 'لا توجد'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">النسخة القادمة:</span>
                    <div className="font-medium">{settings.backup.nextBackup || 'غير محدد'}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => createBackupMutation.mutate()}
                  disabled={createBackupMutation.isPending}
                >
                  <Download className="w-4 h-4 mr-2" />
                  إنشاء نسخة احتياطية الآن
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  استرداد نسخة احتياطية
                </Button>
              </div>

              {backupHistory && Array.isArray(backupHistory) && backupHistory.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">تاريخ t("admin.backups", "Backups")</h3>
                  {backupHistory.slice(0, 5).map((backup: any) => (
                    <div key={backup.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{backup.name}</div>
                        <div className="text-sm text-gray-600">{backup.created_at}</div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{backup.size}</Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => restoreBackupMutation.mutate(backup.id)}
                        >
                          استرداد
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring */}
        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>t("admin.system_monitoring", "System Monitoring")</CardTitle>
              <CardDescription>مراقبة أداء النظام والخدمات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">حالة الخدمات</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {systemHealth?.services?.map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{service.name}</span>
                        <Badge variant={service.status === 'online' ? 'default' : 'destructive'}>
                          {service.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">إحصائيات الخادم</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">وقت التشغيل:</span>
                      <span className="font-medium">{systemHealth?.server.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">اتصالات قاعدة البيانات:</span>
                      <span className="font-medium">{systemHealth?.database.connectionCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">زمن استجابة قاعدة البيانات:</span>
                      <span className="font-medium">{systemHealth?.database.responseTime}ms</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}