import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default function TourCategoriesPage() {
  return (
    <DashboardLayout>
      <CategoryManager
        title="Tour Categories"
        description="Create and manage categories for your tours."
        categoryType="tour"
        apiEndpoint="/api/tour-categories"
      />
    </DashboardLayout>
  );
}