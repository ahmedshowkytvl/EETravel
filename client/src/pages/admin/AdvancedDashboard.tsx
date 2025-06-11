import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { 
  Users, Package, Hotel, MapPin, Calendar, TrendingUp, 
  Activity, Bell, Settings, Eye, Edit, Trash2, Plus,
  Download, Upload, Search, Filter, MoreHorizontal,
  DollarSign, Plane, Globe, Star, Clock, AlertCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  activePackages: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user: string;
  }>;
  bookingsByMonth: Array<{ month: string; count: number; revenue: number }>;
  popularDestinations: Array<{ name: string; bookings: number; percentage: number }>;
  userGrowth: Array<{ month: string; users: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdvancedDashboard() {
  const { t } = useLanguage();
  const [dateRange, setDateRange] = useState("30");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/dashboard/stats', dateRange],
  });

  const { data: recentBookings = [] } = useQuery({
    queryKey: ['/api/admin/bookings/recent'],
  });

  const { data: systemHealth = { 
    status: 'healthy', 
    database: { status: 'connected', connectionCount: 0, responseTime: 0 }, 
    server: { uptime: '0h 0m', cpuUsage: 0, memoryUsage: 0, diskUsage: 0 }, 
    services: [] 
  } } = useQuery({
    queryKey: ['/api/admin/system/health'],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const quickActions = [
    { icon: Plus, label: t("admin.add_tour", "Add Tour"), href: "/admin/tours/create", color: "bg-blue-500" },
    { icon: Hotel, label: t("admin.add_hotel", "Add Hotel"), href: "/admin/hotels/create", color: "bg-green-500" },
    { icon: Package, label: t("admin.add_package", "Add Package"), href: "/admin/packages/create", color: "bg-purple-500" },
    { icon: Users, label: t("admin.manage_users", "Manage Users"), href: "/admin/users", color: "bg-orange-500" },
    { icon: MapPin, label: t("admin.manage_destinations", "Manage Destinations"), href: "/admin/destinations", color: "bg-red-500" },
    { icon: Settings, label: t("admin.system_settings", "System Settings"), href: "/admin/settings", color: "bg-gray-500" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("admin.advanced_dashboard", "Advanced Dashboard")}</h1>
          <p className="text-gray-600 mt-1">{t("admin.dashboard_overview", "Comprehensive overview of Sahara Journeys platform")}</p>
        </div>
        <div className="flex gap-3">
          <Input
            placeholder={t("admin.search_system", "Search in system...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t("admin.export_data", "Export Data")}
          </Button>
        </div>
      </div>

      {/* System Health Alert */}
      {systemHealth?.status !== 'healthy' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">{t("admin.system_warning", "System Warning")}</p>
                <p className="text-sm text-orange-600">{t("admin.performance_issues", "Performance issues need attention")}</p>
              </div>
              <Button size="sm" variant="outline" className="mr-auto">
                {t("admin.view_details", "View Details")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t("admin.total_users", "Total Users")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers.toLocaleString()}</div>
            <p className="text-blue-100 text-sm">{t("admin.change_from_last_month", "+12% from last month")}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t("admin.total_bookings", "Total Bookings")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBookings.toLocaleString()}</div>
            <p className="text-green-100 text-sm">{t("admin.bookings_change", "+8% from last month")}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              {t("admin.total_revenue", "Total Revenue")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalRevenue.toLocaleString()}</div>
            <p className="text-purple-100 text-sm">{t("admin.revenue_change", "+15% from last month")}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="w-4 h-4" />
              t("admin.active_packages", "Active Packages")
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activePackages}</div>
            <p className="text-orange-100 text-sm">5 باقات جديدة هذا الأسبوع</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            إجراءات سريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 hover:shadow-md transition-shadow"
                >
                  <div className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-center">{action.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>إحصائيات الحجوزات</CardTitle>
            <CardDescription>الحجوزات والإيرادات خلال الأشهر الماضية</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.bookingsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الوجهات الأكثر شعبية</CardTitle>
            <CardDescription>توزيع الحجوزات حسب الوجهة</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.popularDestinations}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="bookings"
                >
                  {stats?.popularDestinations?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Management Tabs */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bookings">الحجوزات الحديثة</TabsTrigger>
          <TabsTrigger value="users">المستخدمون الجدد</TabsTrigger>
          <TabsTrigger value="revenue">تحليل الإيرادات</TabsTrigger>
          <TabsTrigger value="activity">النشاط الأخير</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                الحجوزات الحديثة
                <Button size="sm" variant="outline">
                  t("admin.view", "View") الكل
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings?.slice(0, 5).map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-sm text-gray-600">{booking.packageName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${booking.totalAmount}</p>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>نمو المستخدمين</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats?.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>تحليل الإيرادات المفصل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">$125,430</div>
                  <p className="text-sm text-gray-600">إيرادات هذا الشهر</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">$98,750</div>
                  <p className="text-sm text-gray-600">متوسط الإيرادات الشهرية</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">$1,245,000</div>
                  <p className="text-sm text-gray-600">t("admin.total_revenue", "Total Revenue") السنوية</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>سجل النشاط الأخير</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentActivity?.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
                    <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}