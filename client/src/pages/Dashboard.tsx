import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { GaugeIcon, PackageIcon, UsersIcon, MapIcon, CalendarIcon } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-neutral-600">Manage your travel packages and bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <PackageIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Packages</p>
              <h3 className="text-2xl font-bold">24</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <UsersIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Active Bookings</p>
              <h3 className="text-2xl font-bold">118</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MapIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Destinations</p>
              <h3 className="text-2xl font-bold">16</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">This Month</p>
              <h3 className="text-2xl font-bold">$24,568</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="packages" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="packages">
          <Card>
            <CardHeader>
              <CardTitle>Manage Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">This is a placeholder for the package management interface.</p>
              <div className="border border-dashed border-neutral-300 rounded-lg p-12 text-center mt-4">
                <GaugeIcon className="h-12 w-12 text-neutral-400 mb-4 mx-auto" />
                <h3 className="text-lg font-medium mb-2">Package Management Coming Soon</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  This section will allow you to add, edit, and manage all your travel packages from a single dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Manage Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">This is a placeholder for the booking management interface.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Manage Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">This is a placeholder for the customer management interface.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">This is a placeholder for the analytics dashboard.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
