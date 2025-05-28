import React from "react";
import { Button } from "@/components/ui/button";
import { Users, Map, Building2, Calendar } from "lucide-react";
import { handleImageError } from '@/lib/image-utils';

const ExploreSection: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left side - Image with stats */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden h-[500px] ">
              <img
                src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&amp;w=1000&amp;auto=format&amp;fit=crop"
                alt="Traveler on a cliff"
                className="w-[90%] h-[90%] object-cover rounded-2xl mx-auto my-auto"
                onError={handleImageError}
              />
            </div>

            {/* Floating stats */}
            <div className=" absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-md">
              <div className="flex items-center gap-2">
                <Users className="text-[#2f6088]" size={18} />
                <div>
                  <p className="text-sm text-neutral-500">Tourists</p>
                  <p className="text-xl font-bold text-[#2f6088]">5000+</p>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm px-6 py-5 rounded-xl shadow-md">
              <div className="flex items-center gap-2">
                <Map className="text-[#2f6088]" size={20} />
                <div>
                  <p className="text-sm text-neutral-500">Destinations</p>
                  <p className="text-2xl font-bold text-[#2f6088]">300+</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-md">
              <div className="flex items-center gap-2">
                <Building2 className="text-[#2f6088]" size={18} />
                <div>
                  
                  <p className="text-sm text-neutral-500">Hotels</p>
                  <p className="text-xl font-bold text-[#2f6088]">150+</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Text content */}
          <div className="md:pl-8">
            <h2 className="text-3xl font-bold mb-6">
              Travel Any Corner Of The World With Us
            </h2>
            <p className="text-neutral-600 mb-4">
              Our travel agency specializes in creating unforgettable
              experiences for adventurous souls. We handle every aspect of your
              journey, from accommodations and transportation to guided tours
              and special activities.
            </p>
            <p className="text-neutral-600 mb-8">
              Whether you're looking for a relaxing beach getaway, an
              adventurous mountain expedition, or a cultural city tour, our
              expert travel consultants will craft the perfect itinerary
              tailored to your preferences, budget, and dream destinations.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <div className="flex items-center gap-2">
                  <Calendar className="text-[#2f6088]" />
                  <span className="font-medium">Flexible Booking</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  Free cancellation options available
                </p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <div className="flex items-center gap-2">
                  <Users className="text-[#2f6088]" />
                  <span className="font-medium">Expert Guides</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  Local, knowledgeable tour guides
                </p>
              </div>
            </div>

            <Button className="bg-[#2f6088] hover:bg-[#2f6088]/90 text-white px-8 py-2.5 rounded-md text-sm font-medium transition-colors">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
