import React from "react";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default function TourCategoriesPage() {
  return (
    <CategoryManager
      title="Tour Categories"
      description="Create and manage categories for your tours."
      categoryType="tour"
      apiEndpoint="/api/tour-categories"
    />
  );
}