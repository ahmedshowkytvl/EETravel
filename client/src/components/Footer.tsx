import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import SocialMediaBox from "./SocialMediaBox";
import ZigzagText from "./ZigzagText";
import logo from "../assets/EgyptExpressTvl-logo.png";
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../hooks/use-language";

// Define types for menu data
interface MenuItem {
  id: number;
  title: string;
  url: string;
  icon: string | null;
  itemType?: string;
  order: number;
  menuId: number;
  parentId: number | null;
  target: string | null;
  active: boolean;
}

interface Menu {
  id: number;
  name: string;
  location: string;
  description: string | null;
  active: boolean;
}

interface MenuResponse {
  menu: Menu;
  items: MenuItem[];
}

const Footer: React.FC = () => {
  const { t, isRTL } = useLanguage();
  
  // Fetch the "footer" menu from the API
  const { data: footerMenu, isLoading } = useQuery<MenuResponse>({
    queryKey: ['/api/menus/location/footer'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/menus/location/footer');
        if (!response.ok) {
          throw new Error('Failed to fetch footer menu');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching footer menu:', error);
        return { menu: null, items: [] };
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    // By default, return null if there's an error or no menu found
    refetchOnWindowFocus: false
  });

  // Function to organize menu items by section (heading)
  const organizeMenuItemsBySection = (items: MenuItem[] = []): Record<string, MenuItem[]> => {
    const sections: Record<string, MenuItem[]> = {};
    
    // First find all heading items
    const headings = items.filter(item => item.itemType === 'heading');
    
    // If we have heading items, use them as sections
    if (headings.length > 0) {
      // Initialize each section with the heading
      headings.forEach(heading => {
        sections[`section-${heading.id}`] = [heading];
      });
      
      // Add child items to their respective sections
      items.filter(item => item.itemType !== 'heading').forEach(item => {
        if (item.parentId) {
          const sectionKey = `section-${item.parentId}`;
          if (sections[sectionKey]) {
            sections[sectionKey].push(item);
          }
        }
      });
    } else {
      // If no headings, put all items in a default section
      sections['default'] = items;
    }
    
    // Sort items in each section by order
    Object.keys(sections).forEach(key => {
      sections[key].sort((a, b) => a.order - b.order);
    });
    
    return sections;
  };

  // Function to render menu items based on the fetched data or fallback to hardcoded links
  const renderMenuLinks = (location: string) => {
    // If we have loaded menu items and we have a menu
    if (!isLoading && footerMenu?.menu && footerMenu?.items.length > 0 && footerMenu?.menu.location === location) {
      const organizedSections = organizeMenuItemsBySection(footerMenu.items);
      
      // If we have sections with headings
      if (Object.keys(organizedSections).some(key => key !== 'default')) {
        return Object.entries(organizedSections).map(([sectionKey, sectionItems]) => {
          // Skip empty sections
          if (sectionItems.length === 0) return null;
          
          // Get the heading (first item if it's a heading)
          const heading = sectionItems[0].itemType === 'heading' ? sectionItems[0] : null;
          
          // Get the links (all non-heading items or all items if no heading)
          const links = heading ? sectionItems.slice(1) : sectionItems;
          
          return (
            <div key={sectionKey} className="mb-8">
              {heading && (
                <h3 className="text-lg font-bold mb-4">
                  <ZigzagText
                    text={heading.title}
                    underlineColor="#2f638f"
                    underlineWidth={2}
                  />
                </h3>
              )}
              
              <ul className="space-y-2">
                {links.map(item => (
                  <li key={item.id}>
                    <Link
                      href={item.url}
                      className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                      target={item.target || undefined}
                    >
                      <FontAwesomeIcon icon={faAngleRight} className="text-[#2f638f] text-xs" />
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        });
      } else {
        // Legacy format - just render all items as links
        const sortedItems = [...footerMenu.items].sort((a, b) => a.order - b.order);
        
        return sortedItems.map(item => (
          <li key={item.id}>
            <Link
              href={item.url}
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
              target={item.target || undefined}
            >
              <FontAwesomeIcon icon={faAngleRight} className="text-[#2f638f] text-xs" />
              {item.title}
            </Link>
          </li>
        ));
      }
    }

    // Fallback hardcoded quick links if no menu data is available
    if (location === 'footer') {
      return (
        <>
          <li>
            <Link
              href="/"
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faAngleRight} className="text-[#2f638f] text-xs" />
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/destinations"
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faAngleRight} className="text-[#2f638f] text-xs" />
              Destinations
            </Link>
          </li>
          <li>
            <Link
              href="/packages"
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faAngleRight} className="text-[#2f638f] text-xs" />
              Packages
            </Link>
          </li>
          <li>
            <Link
              href="/visas"
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faAngleRight} className="text-[#2f638f] text-xs" />
              Visas
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faAngleRight} className="text-[#2f638f] text-xs" />
              About Us
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faAngleRight} className="text-[#2f638f] text-xs" />
              Contact
            </Link>
          </li>
        </>
      );
    }

    // Default empty if location doesn't match
    return null;
  };

  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col items-center bg-[#37383c] rounded-[5px] p-6 shadow-md">
            <div className="bg-white p-4 rounded-md flex items-center justify-center mb-4 mx-auto">
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/src/assets/EgyptExpressTvl-logo.png";
                }}
              />
            </div>
            <p className="text-white mb-6 text-center">
              {t('footer.description', 'The proper Footer on proper time can preserve you protection. We assist you make sure everybody forward.')}
            </p>
            <div className="flex space-x-4 justify-center">
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  className="w-5 h-5 fill-[#2f6088]"
                >
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-5 h-5 fill-[#2f6088]"
                >
                  <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-5 h-5 fill-[#2f6088]"
                >
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  className="w-5 h-5 fill-[#2f6088]"
                >
                  <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Menu Sections */}
          {renderMenuLinks('footer')}

          <div>
            <h3 className="text-lg font-bold mb-4">
              <ZigzagText
                text={t('footer.topdestinations', 'Top Destinations')}
                underlineColor="#2f638f"
                underlineWidth={2}
                highlightChars={6}
              />
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/destinations/cairo"
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faAngleRight} className={`text-[#2f638f] text-xs ${isRTL ? 'order-2' : ''}`} />
                  {t('footer.dest.cairo', 'Cairo, Egypt')}
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/dubai"
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faAngleRight} className={`text-[#2f638f] text-xs ${isRTL ? 'order-2' : ''}`} />
                  {t('footer.dest.dubai', 'Dubai, UAE')}
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/petra"
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faAngleRight} className={`text-[#2f638f] text-xs ${isRTL ? 'order-2' : ''}`} />
                  {t('footer.dest.petra', 'Petra, Jordan')}
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/marrakech"
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faAngleRight} className={`text-[#2f638f] text-xs ${isRTL ? 'order-2' : ''}`} />
                  {t('footer.dest.marrakech', 'Marrakech, Morocco')}
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/istanbul"
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faAngleRight} className={`text-[#2f638f] text-xs ${isRTL ? 'order-2' : ''}`} />
                  {t('footer.dest.istanbul', 'Istanbul, Turkey')}
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/doha"
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faAngleRight} className={`text-[#2f638f] text-xs ${isRTL ? 'order-2' : ''}`} />
                  {t('footer.dest.doha', 'Doha, Qatar')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">
              <ZigzagText
                text={t('footer.contactus', 'Contact Us')}
                underlineColor="#2f638f"
                underlineWidth={2}
              />
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className={`mt-1 ${isRTL ? 'ml-3' : 'mr-3'} text-[#2f638f]`} size={18} />
                <span className="text-neutral-400">
                  {t('footer.address', '123 Travel Street, Cairo, Egypt')}
                </span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className={`${isRTL ? 'ml-3' : 'mr-3'} text-[#2f638f]`} size={18} />
                <span className="text-neutral-400">{t('footer.phone', '+20 123 456 7890')}</span>
              </li>
              <li className="flex items-center">
                <MailIcon className={`${isRTL ? 'ml-3' : 'mr-3'} text-[#2f638f]`} size={18} />
                <span className="text-neutral-400">{t('footer.email', 'info@egyptexpress.com')}</span>
              </li>
              <li className="flex items-center">
                <ClockIcon className={`${isRTL ? 'ml-3' : 'mr-3'} text-[#2f638f]`} size={18} />
                <span className="text-neutral-400">{t('footer.hours', 'Mon-Fri: 9am - 6pm')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm mb-4 md:mb-0">
            {t('footer.copyright', '© 2025 Egypt Express Travel. All rights reserved.')}
          </p>
          <div className={`flex ${isRTL ? 'space-x-0 space-x-reverse space-x-6' : 'space-x-6'}`}>
            <Link
              href="/privacy"
              className="text-neutral-500 hover:text-white text-sm transition-colors"
            >
              {t('footer.privacy', 'Privacy Policy')}
            </Link>
            <Link
              href="/terms"
              className="text-neutral-500 hover:text-white text-sm transition-colors"
            >
              {t('footer.terms', 'Terms of Service')}
            </Link>
            <Link
              href="/cookies"
              className="text-neutral-500 hover:text-white text-sm transition-colors"
            >
              {t('footer.cookies', 'Cookie Policy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
