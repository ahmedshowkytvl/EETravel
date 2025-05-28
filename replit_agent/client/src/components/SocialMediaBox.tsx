import React from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function SocialMediaBox() {
  const { t, isRTL } = useLanguage();

  return (
    <div className="max-w-[400px] w-full mx-auto my-8">
      <div className="bg-[#37383c] rounded-[5px] p-6 shadow-lg relative">
        {/* Logo Container */}
        <div className="bg-white rounded-md p-5 mb-6 flex justify-center items-center">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-[46px] h-[46px] bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">SF</span>
            </div>
            <div className="text-gray-800 font-bold text-lg">
              {t('social.company', 'Sahara Journeys')}
            </div>
          </div>
        </div>

        {/* Description Text */}
        <div className="text-white text-sm mb-5 px-2">
          <p className="leading-relaxed">{t('social.description', 'Follow us on social media for the latest updates and travel inspiration.')}</p>
        </div>

        {/* Social Media Icons */}
        <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'} gap-3 px-2 pb-8`}>
          {/* Facebook */}
          <a
            href="#"
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
            aria-label={t('social.facebook', 'Facebook')}
          >
            <Facebook className="text-[#2f6088]" size={16} />
          </a>

          {/* Twitter */}
          <a
            href="#"
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
            aria-label={t('social.twitter', 'Twitter')}
          >
            <Twitter className="text-[#2f6088]" size={16} />
          </a>

          {/* Instagram */}
          <a
            href="#"
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
            aria-label={t('social.instagram', 'Instagram')}
          >
            <Instagram className="text-[#2f6088]" size={16} />
          </a>

          {/* YouTube */}
          <a
            href="#"
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
            aria-label={t('social.youtube', 'YouTube')}
          >
            <Youtube className="text-[#2f6088]" size={16} />
          </a>
          
          {/* Test Keys - will be used to test translation sync */}
          <a
            href="#"
            className="hidden"
            aria-label={t('test.key1', 'Test Key 1')}
          >
            <span>{t('test.key2', 'Test Key 2')}</span>
            <span>{t('test.key3', 'Test Key 3')}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
