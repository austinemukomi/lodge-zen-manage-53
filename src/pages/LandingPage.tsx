
import React, { useState, useEffect } from 'react';
import { Bed, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem 
} from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface LandingPageProps {
  onLogin: () => void;
}

// Background images for the slider
const backgroundImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1920&auto=format&fit=crop'
];

const LandingPage = ({ onLogin }: LandingPageProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Auto-advance the slider every 5 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        <Carousel className="h-full w-full">
          <CarouselContent>
            {backgroundImages.map((image, index) => (
              <CarouselItem key={index} className={`h-full ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}>
                <AspectRatio ratio={16/9} className="h-full">
                  <div 
                    className="h-full w-full bg-cover bg-center transition-opacity duration-1000"
                    style={{ 
                      backgroundImage: `url(${image})`,
                      opacity: index === currentImageIndex ? 1 : 0
                    }}
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Bed className="h-16 w-16 text-primary" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            LodgeMaster
          </h1>
          
          <p className="text-xl sm:text-2xl mb-8 opacity-90">
            The complete hotel & lodge management system for Zimbabwe's hospitality sector
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onLogin} 
              size="lg" 
              className="text-lg px-8 bg-primary hover:bg-primary/90"
            >
              Sign In
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              onClick={onLogin}
              variant="outline" 
              size="lg" 
              className="text-lg px-8 bg-transparent text-white border-white hover:bg-white/10"
            >
              Register
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Room Management</h3>
              <p className="text-sm opacity-80">Real-time tracking of room status and bookings</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Guest Check-in</h3>
              <p className="text-sm opacity-80">Streamlined process for arrivals and departures</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Revenue Reports</h3>
              <p className="text-sm opacity-80">Comprehensive analytics and financial tracking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
