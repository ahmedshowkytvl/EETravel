import React from "react";
import { PackageCreatorForm } from "@/components/dashboard/PackageCreatorForm";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Home, Package } from "lucide-react";

export default function PackagesPage() {
  const { t } = useLanguage();
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
            <BreadcrumbLink href="/admin/packages" className="flex items-center gap-1">
              <Package size={16} />
              <span>Packages</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span>Create New Package</span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-6 text-zinc-800">Create New Package</h1>
        <PackageCreatorForm />
      </div>
    </div>
  );
}