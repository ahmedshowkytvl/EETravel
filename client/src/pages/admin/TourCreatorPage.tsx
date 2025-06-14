import React from "react";
import { useLocation, useParams } from "wouter";
import { TourCreatorForm } from "../../components/dashboard/TourCreatorForm";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Home, Map, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function TourCreatorPage() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const params = useParams();
  const tourId = params?.id; // Get tour ID from URL if it exists
  const isEditMode = !!tourId;
  
  const pageTitle = isEditMode ? "Edit Tour" : "Create New Tour";

  return (
    <div>
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin" className="flex items-center gap-1">
              <Home size={16} />
              <span>Dashboard</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/tours" className="flex items-center gap-1">
              <Map size={16} />
              <span>Tours</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span>{pageTitle}</span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-zinc-800">{pageTitle}</h1>
          <Button variant="outline" className="gap-1" onClick={() => setLocation("/admin/tours")}>
            <ArrowLeft size={16} />
            <span>Back to Tours</span>
          </Button>
        </div>
        <TourCreatorForm tourId={tourId} />
      </div>
    </div>
  );
}