import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { handleImageError } from '@/lib/image-utils';
import { useLanguage } from '@/hooks/use-language';

const specialOffers = [
  {
    id: 1,
    destination: 'Cairo & Luxor',
    tag: 'Egypt Vacation',
    duration: '8 Days',
    price: 699,
    originalPrice: 799,
    date: {
      day: '15',
      month: 'Aug'
    },
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    destination: 'Dubai City Tour',
    tag: 'UAE Vacation',
    duration: '5 Days',
    price: 599,
    originalPrice: 699,
    date: {
      day: '20',
      month: 'Sep'
    },
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    destination: 'Petra Adventure',
    tag: 'Jordan Vacation',
    duration: '6 Days',
    price: 749,
    originalPrice: 849,
    date: {
      day: '10',
      month: 'Oct'
    },
    image: 'https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    destination: 'Morocco Express',
    tag: 'Morocco Vacation',
    duration: '7 Days',
    price: 799,
    originalPrice: 920,
    date: {
      day: '05',
      month: 'Nov'
    },
    image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=800&auto=format&fit=crop',
  }
];

const FeaturedOffers: React.FC = () => {
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };
  
  // Function to check if we can scroll left or right
  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // Check if we can scroll left (scrollLeft > 0)
    setCanScrollLeft(container.scrollLeft > 0);
    
    // Check if we can scroll right (scrollLeft < scrollWidth - clientWidth)
    const hasRightScroll = container.scrollLeft < (container.scrollWidth - container.clientWidth - 5);
    setCanScrollRight(hasRightScroll);
  };
  
  // Set up scroll event listener
  useEffect(() => {
    // Need to wait for the container to be available
    setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      // Check initial scroll state
      checkScrollability();
      
      // Add scroll event listener
      container.addEventListener('scroll', checkScrollability);
      
      // Clean up
      return () => {
        container.removeEventListener('scroll', checkScrollability);
      };
    }, 100);
  }, []);
  
  // Re-check scrollability when window size changes
  useEffect(() => {
    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="pt-32 md:pt-24 pb-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center mb-10">
          <h2 className="text-3xl font-bold">{t('offers.title', 'Special Upcoming Offers')}</h2>
        </div>
        
        <div className="relative">
          {/* Left scroll button */}
          <Button 
            onClick={scrollLeft} 
            variant="outline" 
            size="icon" 
            className={`absolute -left-3 top-1/2 transform -translate-y-1/2 z-10 rounded-full border-[#2f6088] text-[#2f6088] hover:bg-[#2f6088] hover:text-white transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-md ${!canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            aria-hidden={!canScrollLeft}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="sr-only">{t('common.scrollLeft', 'Scroll left')}</span>
          </Button>
          
          {/* Right scroll button */}
          <Button 
            onClick={scrollRight} 
            variant="outline" 
            size="icon" 
            className={`absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 rounded-full border-[#2f6088] text-[#2f6088] hover:bg-[#2f6088] hover:text-white transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-md ${!canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            aria-hidden={!canScrollRight}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="m9 18 6-6-6-6"/>
            </svg>
            <span className="sr-only">{t('common.scrollRight', 'Scroll right')}</span>
          </Button>
          
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide scroll-smooth px-2"
          >
            {specialOffers.map((offer) => (
              <Card key={offer.id} className="bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 w-full sm:w-[350px] transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div className="relative">
                  <img 
                    src={offer.image} 
                    alt={offer.destination} 
                    className="w-full h-52 object-cover rounded-t-xl"
                    onError={handleImageError}
                  />
                  <div className="absolute top-0 right-0 bottom-0 w-12 flex flex-col items-center justify-center text-white bg-primary/80 font-medium">
                    <span className="text-lg">{offer.date.day}</span>
                    <span className="text-xs uppercase">{offer.date.month}</span>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <Badge className="bg-[#2f6088] hover:bg-[#2f6088]/90 text-white px-3 py-1 rounded-full text-xs">
                      {offer.tag}
                    </Badge>
                    <div className="flex items-center text-neutral-500 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {offer.duration}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{offer.destination}</h3>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-neutral-500 text-sm line-through">${offer.originalPrice}</span>
                      <span className="text-xl font-bold text-[#2f6088] ml-2">${offer.price}</span>
                      <span className="text-neutral-600 text-sm">{t('offers.perPerson', '/Person')}</span>
                    </div>
                    <Button className="bg-[#2f6088] hover:bg-[#2f6088]/90 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                      {t('common.bookNow', 'Book Now')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedOffers;