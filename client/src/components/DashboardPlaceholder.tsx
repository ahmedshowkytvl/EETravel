import React from 'react';
import { GaugeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardPlaceholder: React.FC = () => {
  return (
    <section id="dashboard" className="py-12 bg-neutral-100 border-2 border-dashed border-neutral-300 rounded-lg m-4">
      <div className="container mx-auto px-4 text-center">
        <GaugeIcon className="h-12 w-12 text-neutral-400 mb-4 mx-auto" />
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Dashboard Coming Soon</h2>
        <p className="text-neutral-600 max-w-xl mx-auto mb-6">
          This section will allow administrators to manage packages, content, and track bookings.
        </p>
        <Button variant="outline" className="bg-neutral-300 hover:bg-neutral-400 text-neutral-800 px-6 py-3 rounded-md font-medium transition-colors">
          Placeholder Button
        </Button>
      </div>
    </section>
  );
};

export default DashboardPlaceholder;
