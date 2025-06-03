import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { FacilityManager } from "@/components/admin/FacilityManager";

export default function HotelCleanlinessPage() {
  return (
    <DashboardLayout>
      <FacilityManager
        title="Cleanliness & Safety Features"
        description="Create and manage cleanliness and safety features for your hotels. These will be selectable when creating or editing hotels."
        facilityType="cleanliness"
        apiEndpoint="/api/admin/cleanliness-features"
      />
    </DashboardLayout>
  );
}