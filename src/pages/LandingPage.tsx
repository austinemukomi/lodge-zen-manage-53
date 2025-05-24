
import React from 'react';
import { Bed } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage = ({ onLogin }: LandingPageProps) => {
  return (
    <div className="h-screen relative overflow-hidden">
      {/* Static Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop)`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover'
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Bed className="h-16 w-16 sm:h-20 sm:w-20 text-primary" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            LodgeMaster
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            The complete hotel & lodge management system for Zimbabwe's hospitality sector
          </p>
          
          <div className="flex justify-center mb-12">
            <Button 
              onClick={onLogin} 
              size="lg" 
              className="text-lg px-8 py-3 bg-primary hover:bg-primary/90 shadow-2xl"
            >
              SignIn
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-black/30 backdrop-blur-sm p-4 sm:p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Room Management</h3>
              <p className="text-sm opacity-80">Real-time tracking of room status and bookings</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm p-4 sm:p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Guest Check-in</h3>
              <p className="text-sm opacity-80">Streamlined process for arrivals and departures</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm p-4 sm:p-6 rounded-lg">
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
