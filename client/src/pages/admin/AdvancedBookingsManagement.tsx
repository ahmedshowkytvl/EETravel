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
import { 
  Calendar, Clock, MapPin, User, Phone, Mail, CreditCard,
  Filter, Search, Download, Eye, Edit, MessageSquare,
  CheckCircle, XCircle, AlertCircle, DollarSign, Plane,
  FileText, Send, RefreshCw, Archive, Star, Users
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";

interface Booking {
  id: number;
  bookingReference: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageName: string;
  packageId: number;
  checkInDate: string;
  checkOutDate: string;
  travelers: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  destination: string;
  bookingType: string;
}

const statusColors: Record<string, string> = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'confirmed': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800',
  'completed': 'bg-blue-100 text-blue-800',
  'in_progress': 'bg-purple-100 text-purple-800'
};

const paymentStatusColors: Record<string, string> = {
  'paid': 'bg-green-100 text-green-800',
  'partial': 'bg-orange-100 text-orange-800',
  'pending': 'bg-yellow-100 text-yellow-800',
  'failed': 'bg-red-100 text-red-800'
};

export default function AdvancedBookingsManagement() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showStatusUpdateDialog, setShowStatusUpdateDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['/api/admin/bookings', { search: searchTerm, status: statusFilter, date: dateFilter }],
  });

  const { data: bookingStats = { 
    totalBookings: 0, 
    confirmedBookings: 0, 
    pendingBookings: 0, 
    totalRevenue: 0 
  } } = useQuery({
    queryKey: ['/api/admin/bookings/stats'],
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status, note }: { id: number; status: string; note: string }) => {
      return apiRequest(`/api/admin/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bookings'] });
      toast({ title: "تم تحديث حالة الحجز بنجاح" });
      setShowStatusUpdateDialog(false);
      setSelectedBooking(null);
    }
  });

  const sendNotificationMutation = useMutation({
    mutationFn: async ({ bookingId, type, message }: { bookingId: number; type: string; message: string }) => {
      return apiRequest(`/api/admin/bookings/${bookingId}/notify`, {
        method: 'POST',
        body: JSON.stringify({ type, message })
      });
    },
    onSuccess: () => {
      toast({ title: "تم إرسال الإشعار بنجاح" });
    }
  });

  const exportBookingsMutation = useMutation({
    mutationFn: async (filters: any) => {
      return apiRequest('/api/admin/bookings/export', {
        method: 'POST',
        body: JSON.stringify(filters)
      });
    },
    onSuccess: (data) => {
      // Handle file download
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bookings-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast({ title: t("admin.export_success", "Data exported successfully") });
    }
  });

  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.packageName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = () => {
    if (selectedBooking && newStatus) {
      updateBookingStatusMutation.mutate({
        id: selectedBooking.id,
        status: newStatus,
        note: statusNote
      });
    }
  };

  const handleSendNotification = (type: string) => {
    if (selectedBooking) {
      const messages = {
        confirmation: `تم t("admin.confirm", "Confirm") حجزك رقم ${selectedBooking.bookingReference}. نتطلع لخدمتك!`,
        reminder: `تذكير: رحلتك ${selectedBooking.packageName} ستبدأ قريباً في ${selectedBooking.checkInDate}`,
        cancellation: `نأسف لt("admin.cancel", "Cancel") حجزك رقم ${selectedBooking.bookingReference}. سيتم معالجة استرداد المبلغ قريباً.`
      };
      
      sendNotificationMutation.mutate({
        bookingId: selectedBooking.id,
        type,
        message: messages[type as keyof typeof messages]
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">t("admin.advanced_bookings", "Advanced Bookings Management")</h1>
          <p className="text-gray-600 mt-1">إدارة شاملة لجميع الحجوزات والمدفوعات</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => exportBookingsMutation.mutate({ status: statusFilter, search: searchTerm })}
            variant="outline"
            disabled={exportBookingsMutation.isPending}
          >
            <Download className="w-4 h-4 mr-2" />
            t("admin.export_data", "Export Data")
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">t("admin.total_bookings", "Total Bookings")</p>
                <p className="text-2xl font-bold">{bookingStats?.totalBookings || 0}</p>
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
                <p className="text-sm text-gray-600">t("admin.confirmed_bookings", "Confirmed Bookings")</p>
                <p className="text-2xl font-bold">{bookingStats?.confirmedBookings || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">قيد الانتظار</p>
                <p className="text-2xl font-bold">{bookingStats?.pendingBookings || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">t("admin.total_revenue", "Total Revenue")</p>
                <p className="text-2xl font-bold">${bookingStats?.totalRevenue?.toLocaleString() || 0}</p>
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
                placeholder="الt("admin.search", "Search") بالاسم، رقم الحجز، أو اسم الباقة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">t("admin.all_statuses", "All Statuses")</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="confirmed">t("admin.confirmed", "Confirmed")</SelectItem>
                <SelectItem value="in_progress">جاري التنفيذ</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="cancelled">t("admin.cancelled", "Cancelled")</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب التاريخ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التواريخ</SelectItem>
                <SelectItem value="today">اليوم</SelectItem>
                <SelectItem value="week">هذا الأسبوع</SelectItem>
                <SelectItem value="month">هذا الشهر</SelectItem>
                <SelectItem value="quarter">هذا الربع</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الحجوزات ({filteredBookings?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBookings?.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-4">
                      <h3 className="font-semibold text-lg">{booking.customerName}</h3>
                      <Badge className={statusColors[booking.status]}>
                        {booking.status}
                      </Badge>
                      <Badge className={paymentStatusColors[booking.paymentStatus]}>
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span>{booking.bookingReference}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-gray-500" />
                        <span>{booking.packageName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{booking.destination}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{new Date(booking.checkInDate).toLocaleDateString('ar-EG')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{booking.travelers} مسافر</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span>${booking.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDetailsDialog(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowStatusUpdateDialog(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل الحجز - {selectedBooking?.bookingReference}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">التفاصيل</TabsTrigger>
                  <TabsTrigger value="customer">العميل</TabsTrigger>
                  <TabsTrigger value="payment">الدفع</TabsTrigger>
                  <TabsTrigger value="actions">الإجراءات</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>رقم الحجز</Label>
                      <p className="mt-1 font-mono">{selectedBooking.bookingReference}</p>
                    </div>
                    <div>
                      <Label>حالة الحجز</Label>
                      <Badge className={`mt-1 ${statusColors[selectedBooking.status]}`}>
                        {selectedBooking.status}
                      </Badge>
                    </div>
                    <div>
                      <Label>اسم الباقة</Label>
                      <p className="mt-1">{selectedBooking.packageName}</p>
                    </div>
                    <div>
                      <Label>الوجهة</Label>
                      <p className="mt-1">{selectedBooking.destination}</p>
                    </div>
                    <div>
                      <Label>تاريخ البداية</Label>
                      <p className="mt-1">{new Date(selectedBooking.checkInDate).toLocaleDateString('ar-EG')}</p>
                    </div>
                    <div>
                      <Label>تاريخ النهاية</Label>
                      <p className="mt-1">{new Date(selectedBooking.checkOutDate).toLocaleDateString('ar-EG')}</p>
                    </div>
                    <div>
                      <Label>عدد المسافرين</Label>
                      <p className="mt-1">{selectedBooking.travelers}</p>
                    </div>
                    <div>
                      <Label>نوع الحجز</Label>
                      <p className="mt-1">{selectedBooking.bookingType}</p>
                    </div>
                  </div>
                  {selectedBooking.specialRequests && (
                    <div>
                      <Label>طلبات خاصة</Label>
                      <p className="mt-1 p-3 bg-gray-50 rounded border">{selectedBooking.specialRequests}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="customer" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label>اسم العميل</Label>
                      <p className="mt-1 text-lg font-medium">{selectedBooking.customerName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <a href={`mailto:${selectedBooking.customerEmail}`} className="text-blue-600 hover:underline">
                        {selectedBooking.customerEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <a href={`tel:${selectedBooking.customerPhone}`} className="text-blue-600 hover:underline">
                        {selectedBooking.customerPhone}
                      </a>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>المبلغ الإجمالي</Label>
                      <p className="mt-1 text-lg font-bold text-green-600">${selectedBooking.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>المبلغ المدفوع</Label>
                      <p className="mt-1 text-lg font-semibold">${selectedBooking.paidAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>المبلغ المتبقي</Label>
                      <p className="mt-1 text-lg font-semibold text-orange-600">${selectedBooking.remainingAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>حالة الدفع</Label>
                      <Badge className={`mt-1 ${paymentStatusColors[selectedBooking.paymentStatus]}`}>
                        {selectedBooking.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => handleSendNotification('confirmation')}
                      disabled={sendNotificationMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      إرسال t("admin.confirm", "Confirm")
                    </Button>
                    <Button
                      onClick={() => handleSendNotification('reminder')}
                      disabled={sendNotificationMutation.isPending}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      إرسال تذكير
                    </Button>
                    <Button
                      onClick={() => {
                        setShowDetailsDialog(false);
                        setShowStatusUpdateDialog(true);
                      }}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      تحديث الحالة
                    </Button>
                    <Button
                      onClick={() => window.open(`/api/admin/bookings/${selectedBooking.id}/invoice`, '_blank')}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      t("admin.view", "View") الفاتورة
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={showStatusUpdateDialog} onOpenChange={setShowStatusUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تحديث حالة الحجز</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>الحالة الجديدة</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة الجديدة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="confirmed">t("admin.confirmed", "Confirmed")</SelectItem>
                  <SelectItem value="in_progress">جاري التنفيذ</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="cancelled">t("admin.cancelled", "Cancelled")</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>ملاحظة (اختيارية)</Label>
              <Textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="أضف ملاحظة حول سبب التحديث..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowStatusUpdateDialog(false)}>
                t("admin.cancel", "Cancel")
              </Button>
              <Button
                onClick={handleStatusUpdate}
                disabled={!newStatus || updateBookingStatusMutation.isPending}
              >
                تحديث الحالة
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}