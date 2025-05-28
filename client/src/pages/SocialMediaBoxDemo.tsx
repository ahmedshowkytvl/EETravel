import React from 'react';
import SocialMediaBox from '@/components/SocialMediaBox';

export default function SocialMediaBoxDemo() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Social Media Component</h1>
      
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Component Showcase</h2>
          <p className="text-gray-600 mb-6">
            This demonstrates a clean, centered social media container with the following features:
          </p>
          
          <ul className="list-disc list-inside mb-8 text-gray-600">
            <li>Outer box with #37383c background and 5px border radius</li>
            <li>Centered white box containing the Sahara Journeys logo</li>
            <li>Social media icons with #2f6088 color in white circles</li>
            <li>Wave pattern background effect at the bottom</li>
            <li>Fully responsive design</li>
          </ul>
          
          <div className="border-t border-gray-200 pt-8">
            <SocialMediaBox />
          </div>
        </div>
      </div>
    </div>
  );
}