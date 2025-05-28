import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { FacilityManager } from "@/components/admin/FacilityManager";

export default function HotelHighlightsPage() {
  return (
    <DashboardLayout>
      <FacilityManager
        title="Hotel Highlights"
        description="Create and manage general highlights for your hotels. These highlights will be selectable when creating or editing hotels."
        facilityType="highlight"
        apiEndpoint="/api/admin/hotel-highlights"
      />
    </DashboardLayout>
  );
}