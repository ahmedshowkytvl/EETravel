import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default function HotelCategoriesPage() {
  return (
    <DashboardLayout>
      <CategoryManager
        title="Hotel Categories"
        description="Create and manage categories for your hotels."
        categoryType="hotel"
        apiEndpoint="/api/hotel-categories"
      />
    </DashboardLayout>
  );
}