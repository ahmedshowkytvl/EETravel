/**
 * Tour type definitions
 */

export interface Tour {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  galleryUrls: string[];
  destinationId: number | null;
  tripType: string | null;
  duration: number;
  date: string | Date | null;
  endDate?: string | Date | null;
  numPassengers: number | null;
  price: number;
  discountedPrice: number | null;
  included: string[];
  excluded: string[];
  itinerary: string | null;
  maxGroupSize: number | null;
  featured: boolean;
  rating: number | null;
  reviewCount: number;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date | null;
}

export interface TourFormData {
  name: string;
  description: string;
  destinationId: number;
  tripType: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  numPassengers: number;
  price: number;
  discountedPrice: number | null;
  included: string[];
  excluded: string[];
  itinerary: string;
  maxGroupSize: number | null;
  featured: boolean;
  status: string;
  imageUrl?: string;
  galleryUrls?: string[];
}

export interface TourGalleryImage {
  id: string;
  file: File | null;
  preview: string;
}

export interface TourMainImage {
  id: string;
  file: File | null;
  preview: string;
  isMain: boolean;
}

export const tourStatusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "soldout", label: "Sold Out" },
];