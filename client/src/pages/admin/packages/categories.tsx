import React from "react";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default function PackageCategoriesPage() {
  return (
    <CategoryManager
      title="Package Categories"
      description="Create and manage categories for your travel packages."
      categoryType="package"
      apiEndpoint="/api/package-categories"
    />
  );
}