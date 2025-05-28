import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default function PackageCategoriesPage() {
  return (
    <DashboardLayout>
      <CategoryManager
        title="Package Categories"
        description="Create and manage categories for your travel packages."
        categoryType="package"
        apiEndpoint="/api/package-categories"
      />
    </DashboardLayout>
  );
}