import React from "react";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default function HotelCategoriesPage() {
  return (
    <CategoryManager
      title="Hotel Categories"
      description="Create and manage categories for your hotels."
      categoryType="hotel"
      apiEndpoint="/api/hotel-categories"
    />
  );
}