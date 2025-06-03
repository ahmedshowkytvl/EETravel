import React from "react";
import { FacilityManager } from "@/components/admin/FacilityManager";

export default function HotelHighlightsPage() {
  return (
    <div>
      <FacilityManager
        title="Hotel Highlights"
        description="Create and manage general highlights for your hotels. These highlights will be selectable when creating or editing hotels."
        facilityType="highlight"
        apiEndpoint="/api/admin/hotel-highlights"
      />
    </div>
  );
}