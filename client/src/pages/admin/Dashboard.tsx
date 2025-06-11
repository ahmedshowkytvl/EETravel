import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  Package, 
  TrendingUp, 
  Users, 
  CreditCard,
  Building,
  Clock
} from "lucide-react";

export default function Dashboard() {
  const { t } = useLanguage();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-zinc-800">Dashboard</h1>
        <p className="text-zinc-500">Welcome to your admin dashboard.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Total Bookings" 
          value="1,284" 
          trend="+12.5%" 
          icon={<Package className="h-8 w-8 text-blue-500" />} 
        />
        <DashboardCard 
          title="Total Revenue" 
          value="$48,574" 
          trend="+8.2%" 
          icon={<CreditCard className="h-8 w-8 text-emerald-500" />} 
        />
        <DashboardCard 
          title="Active Tours" 
          value="24" 
          trend="+2" 
          icon={<TrendingUp className="h-8 w-8 text-amber-500" />} 
        />
        <DashboardCard 
          title="Registered Users" 
          value="846" 
          trend="+5.3%" 
          icon={<Users className="h-8 w-8 text-purple-500" />} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-zinc-50 rounded-md border">
              <BarChart3 className="h-16 w-16 text-zinc-300" />
              <span className="ml-2 text-zinc-400">Revenue Chart Placeholder</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-zinc-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Cairo Explorer Package</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-zinc-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        2 hours ago
                      </span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Confirmed
                      </span>
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="font-medium">$1,299</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Top Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Cairo, Egypt", "Luxor, Egypt", "Aswan, Egypt", "Sharm El-Sheikh, Egypt"].map((destination, i) => (
                <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{destination}</h4>
                    <div className="w-full h-1.5 bg-zinc-100 rounded-full mt-2">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${90 - i * 15}%` }} 
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{90 - i * 15}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Active Hotels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Pyramids View Hotel", "Nile Palace Resort", "Desert Oasis Lodge", "Royal Pharaoh Hotel"].map((hotel, i) => (
                <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-md bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Building className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{hotel}</h4>
                    <p className="text-xs text-zinc-500 mt-1">
                      {8 - i} packages available
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      i === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {i === 0 ? 'Featured' : 'Active'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, trend, icon }: { 
  title: string; 
  value: string; 
  trend: string; 
  icon: React.ReactNode 
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center">
              {trend}
              <TrendingUp className="ml-1 h-3 w-3" />
            </p>
          </div>
          <div className="mt-1">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}