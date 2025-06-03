import React from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { MultiHotelManualPackageForm } from "@/components/dashboard/MultiHotelManualPackageForm";
import { ArrowLeft, Home, Package, Plus, Hotel } from "lucide-react";

export default function CreateManualPackage() {
  const [, setLocation] = useLocation();
  
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin" className="flex items-center gap-1">
              <Home size={16} />
              <span>Dashboard</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/packages" className="flex items-center gap-1">
              <Package size={16} />
              <span>Packages</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/packages/create-manual" className="flex items-center gap-1">
              <Plus size={16} />
              <span>Create Manual Package</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/admin/packages")}
          className="gap-1"
        >
          <ArrowLeft size={16} />
          <span>Back to Packages</span>
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-2">
          <Hotel size={24} className="text-primary" />
          <h1 className="text-2xl font-bold text-zinc-800">Create Manual Package</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Create a fully customized package with multiple hotels, star ratings, and additional details. Smart suggestions will be provided based on previously entered data.
        </p>
        <MultiHotelManualPackageForm />
      </div>
    </DashboardLayout>
  );
}