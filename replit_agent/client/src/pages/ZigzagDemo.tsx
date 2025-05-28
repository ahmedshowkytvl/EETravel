import React from 'react';
import ZigzagText from '../components/ZigzagText';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const ZigzagDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          <ZigzagText 
            text="Zigzag Text Component Demo" 
            underlineColor="#3b82f6"
            underlineWidth={2}
          />
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {/* Light Color Examples */}
          <Card className="bg-[#1c1c1c] border-neutral-800">
            <CardHeader>
              <CardTitle>
                <ZigzagText 
                  text="Quick Link" 
                  underlineColor="#3b82f6" 
                  className="text-xl font-medium" 
                />
              </CardTitle>
              <CardDescription className="text-neutral-400">
                Default blue underline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-300">
                This example shows how the zigzag underline looks with the default styling
                and blue color.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1c1c1c] border-neutral-800">
            <CardHeader>
              <CardTitle>
                <ZigzagText 
                  text="Blog Post" 
                  underlineColor="#10b981" 
                  className="text-xl font-medium" 
                />
              </CardTitle>
              <CardDescription className="text-neutral-400">
                Green underline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-300">
                This example shows how the zigzag underline looks with a green color
                variation.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1c1c1c] border-neutral-800">
            <CardHeader>
              <CardTitle>
                <ZigzagText 
                  text="Contact Us" 
                  underlineColor="#ec4899" 
                  className="text-xl font-medium" 
                />
              </CardTitle>
              <CardDescription className="text-neutral-400">
                Pink underline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-300">
                This example shows how the zigzag underline looks with a pink color
                option.
              </p>
            </CardContent>
          </Card>
          
          {/* Custom Variations */}
          <Card className="bg-[#1c1c1c] border-neutral-800">
            <CardHeader>
              <CardTitle>
                <ZigzagText 
                  text="Explore Destinations" 
                  underlineColor="#f97316" 
                  underlineWidth={3}
                  className="text-xl font-medium" 
                />
              </CardTitle>
              <CardDescription className="text-neutral-400">
                Thicker orange underline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-300">
                This variation uses a thicker stroke width of 3px and an orange color.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1c1c1c] border-neutral-800">
            <CardHeader>
              <CardTitle>
                <ZigzagText 
                  text="Popular Packages" 
                  underlineColor="#8b5cf6" 
                  highlightChars={7}
                  className="text-xl font-medium" 
                />
              </CardTitle>
              <CardDescription className="text-neutral-400">
                Purple underline, first 7 characters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-300">
                This example highlights the first 7 characters instead of the default 4.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1c1c1c] border-neutral-800">
            <CardHeader>
              <CardTitle>
                <ZigzagText 
                  text="VISA Services" 
                  underlineColor="#f43f5e" 
                  underlineWidth={1}
                  className="text-xl font-medium" 
                />
              </CardTitle>
              <CardDescription className="text-neutral-400">
                Thin red underline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-300">
                This example uses a thinner 1px stroke width with a rose red color.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-16">
          <h2 className="text-2xl mb-6">
            <ZigzagText 
              text="Navigation Example" 
              underlineColor="#a855f7"
              underlineWidth={2.5} 
            />
          </h2>
          
          <div className="flex flex-wrap justify-center gap-12 mt-8">
            <div className="text-lg">
              <ZigzagText text="Quick Link" underlineColor="#60a5fa" />
            </div>
            <div className="text-lg">
              <ZigzagText text="Blog" underlineColor="#60a5fa" />
            </div>
            <div className="text-lg">
              <ZigzagText text="Contact" underlineColor="#60a5fa" />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ZigzagDemo;