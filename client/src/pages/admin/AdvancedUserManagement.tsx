import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, UserPlus, Shield, Clock, Mail, Phone, MapPin,
  Search, Filter, Download, Eye, Edit, Ban, CheckCircle,
  Star, Calendar, CreditCard, Activity, AlertTriangle,
  Settings, Lock, Unlock, MoreHorizontal, FileText
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";

interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  status: string;
  avatarUrl: string;
  nationality: string;
  dateOfBirth: string;
  lastLoginAt: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  totalBookings: number;
  totalSpent: number;
  preferredLanguage: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
}

const roleColors: Record<string, string> = {
  'admin': 'bg-red-100 text-red-800',
  'manager': 'bg-purple-100 text-purple-800',
  'agent': 'bg-blue-100 text-blue-800',
  'user': 'bg-green-100 text-green-800',
  'vip': 'bg-yellow-100 text-yellow-800'
};

const statusColors: Record<string, string> = {
  'active': 'bg-green-100 text-green-800',
  'inactive': 'bg-gray-100 text-gray-800',
  'suspended': 'bg-red-100 text-red-800',
  'pending': 'bg-yellow-100 text-yellow-800'
};

export default function AdvancedUserManagement() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users', { search: searchTerm, role: roleFilter, status: statusFilter }],
  });

  const { data: userStats = { 
    totalUsers: 0, 
    activeUsers: 0, 
    adminUsers: 0, 
    vipUsers: 0 
  } } = useQuery<{
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    vipUsers: number;
  }>({
    queryKey: ['/api/admin/users/stats'],
  });

  const { data: roles } = useQuery({
    queryKey: ['/api/admin/roles'],
  });

  const updateUserMutation = useMutation({
    mutationFn: async (userData: Partial<User>) => {
      return apiRequest(`/api/admin/users/${userData.id}`, {
        method: 'PATCH',
        body: JSON.stringify(userData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "تم تحديث بيانات المستخدم بنجاح" });
      setShowUserDialog(false);
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: Partial<User>) => {
      return apiRequest('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "تم إنشاء المستخدم بنجاح" });
      setShowCreateDialog(false);
    }
  });

  const suspendUserMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: number; reason: string }) => {
      return apiRequest(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "تم تعليق المستخدم بنجاح" });
    }
  });

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getUserInitials = (user: User) => {
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || user.username[0].toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("admin.manage_users", "Manage Users")} المتقدمة</h1>
          <p className="text-gray-600 mt-1">إدارة شاملة للمستخدمين والأدوار والصلاحيات</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowCreateDialog(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            {t("admin.add_new_user", "Add New User")}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("admin.total_users", "Total Users")}</p>
                <p className="text-2xl font-bold">{userStats?.totalUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("admin.active_users", "Active Users")}</p>
                <p className="text-2xl font-bold">{userStats?.activeUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("admin.admin_users", "Admin Users")}</p>
                <p className="text-2xl font-bold">{userStats?.adminUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("admin.vip_users", "VIP Users")}</p>
                <p className="text-2xl font-bold">{userStats?.vipUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t("admin.search_users_placeholder", "Search by name, email, or username...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدوار</SelectItem>
                <SelectItem value="admin">مدير</SelectItem>
                <SelectItem value="manager">مدير مساعد</SelectItem>
                <SelectItem value="agent">وكيل</SelectItem>
                <SelectItem value="user">مستخدم عادي</SelectItem>
                <SelectItem value="vip">عميل مميز</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">t("admin.all_statuses", "All Statuses")</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="suspended">t("admin.pending", "Pending")</SelectItem>
                <SelectItem value="pending">قيد المراجعة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المستخدمين ({filteredUsers?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers?.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{user.displayName || `${user.firstName} ${user.lastName}`}</h3>
                        <Badge className={roleColors[user.role]}>
                          {user.role}
                        </Badge>
                        <Badge className={statusColors[user.status]}>
                          {user.status}
                        </Badge>
                        {user.emailVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        {user.phoneNumber && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{user.phoneNumber}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>انضم في {new Date(user.createdAt).toLocaleDateString('ar-EG')}</span>
                        </div>
                        {user.lastLoginAt && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>آخر دخول {new Date(user.lastLoginAt).toLocaleDateString('ar-EG')}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          <span>{user.totalBookings} حجز</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="w-4 h-4 text-gray-500" />
                          <span>${user.totalSpent?.toLocaleString()} إجمالي الإنفاق</span>
                        </div>
                        {user.nationality && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>{user.nationality}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserDialog(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowPermissionsDialog(true);
                      }}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    {user.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => suspendUserMutation.mutate({ userId: user.id, reason: 'Manual suspension' })}
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => updateUserMutation.mutate({ id: user.id, status: 'active' })}
                      >
                        <Unlock className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل المستخدم - {selectedUser?.displayName}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
                <TabsTrigger value="activity">النشاط</TabsTrigger>
                <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
                <TabsTrigger value="settings">الإعدادات</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={selectedUser.avatarUrl} />
                    <AvatarFallback className="text-xl">{getUserInitials(selectedUser)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedUser.displayName}</h2>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className={roleColors[selectedUser.role]}>{selectedUser.role}</Badge>
                      <Badge className={statusColors[selectedUser.status]}>{selectedUser.status}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>الاسم الأول</Label>
                    <Input value={selectedUser.firstName || ''} readOnly />
                  </div>
                  <div>
                    <Label>الاسم الأخير</Label>
                    <Input value={selectedUser.lastName || ''} readOnly />
                  </div>
                  <div>
                    <Label>اسم المستخدم</Label>
                    <Input value={selectedUser.username} readOnly />
                  </div>
                  <div>
                    <Label>رقم الهاتف</Label>
                    <Input value={selectedUser.phoneNumber || ''} readOnly />
                  </div>
                  <div>
                    <Label>الجنسية</Label>
                    <Input value={selectedUser.nationality || ''} readOnly />
                  </div>
                  <div>
                    <Label>تاريخ الميلاد</Label>
                    <Input value={selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString('ar-EG') : ''} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedUser.totalBookings}</div>
                    <p className="text-sm text-gray-600">t("admin.total_bookings", "Total Bookings")</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">${selectedUser.totalSpent?.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">إجمالي الإنفاق</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleDateString('ar-EG') : 'لم يسجل دخول'}
                    </div>
                    <p className="text-sm text-gray-600">آخر دخول</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>سجل النشاط الأخير</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
                        <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium">تسجيل دخول جديد</p>
                          <p className="text-sm text-gray-600">منذ ساعتين</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 border-l-4 border-green-500 bg-green-50 rounded">
                        <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">حجز جديد - رحلة دبي</p>
                          <p className="text-sm text-gray-600">منذ يوم واحد</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>تاريخ الحجوزات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">لا توجد حجوزات لt("admin.view", "View")ها</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>إشعارات البريد الإلكتروني</Label>
                      <p className="text-sm text-gray-600">تلقي إشعارات عبر البريد الإلكتروني</p>
                    </div>
                    <Switch checked={selectedUser.emailNotifications} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>إشعارات الرسائل النصية</Label>
                      <p className="text-sm text-gray-600">تلقي إشعارات عبر الرسائل النصية</p>
                    </div>
                    <Switch checked={selectedUser.smsNotifications} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>رسائل تسويقية</Label>
                      <p className="text-sm text-gray-600">تلقي عروض وأخبار تسويقية</p>
                    </div>
                    <Switch checked={selectedUser.marketingEmails} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>t("admin.add_new_user", "Add New User")</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الاسم الأول</Label>
                <Input placeholder="أدخل الاسم الأول" />
              </div>
              <div>
                <Label>الاسم الأخير</Label>
                <Input placeholder="أدخل الاسم الأخير" />
              </div>
              <div>
                <Label>اسم المستخدم</Label>
                <Input placeholder="أدخل اسم المستخدم" />
              </div>
              <div>
                <Label>البريد الإلكتروني</Label>
                <Input type="email" placeholder="أدخل البريد الإلكتروني" />
              </div>
              <div>
                <Label>كلمة المرور</Label>
                <Input type="password" placeholder="أدخل كلمة المرور" />
              </div>
              <div>
                <Label>رقم الهاتف</Label>
                <Input placeholder="أدخل رقم الهاتف" />
              </div>
              <div>
                <Label>الدور</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">مستخدم عادي</SelectItem>
                    <SelectItem value="agent">وكيل</SelectItem>
                    <SelectItem value="manager">مدير مساعد</SelectItem>
                    <SelectItem value="admin">مدير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>الحالة</Label>
                <Select defaultValue="active">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                    <SelectItem value="pending">قيد المراجعة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                t("admin.cancel", "Cancel")
              </Button>
              <Button onClick={() => createUserMutation.mutate({})}>
                إنشاء المستخدم
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}