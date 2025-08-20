import React from 'react';
import { Leaf } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import { ImageCard } from './ImageCard';

export const HeroSection: React.FC = () => {
  const mainTags = [
    'Innovative Agriculture',
    'Sustainable Farming',
    'Eco-friendly Solutions',
    'Future of Farming',
    'Green Technology'
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <Badge variant="success">
              Empowering Modern Agriculture
            </Badge>
            
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Sustainable{' '}
                <span className="inline-flex items-center gap-2">
                  farming
                  <Leaf className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-600" />
                </span>
                {' '}solutions for a better tomorrow.
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
                Brings cutting-edge technology and innovative practices to the world of agriculture, 
                helping you maximize yields, reduce waste, and enhance sustainability.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary">
                Get Started Today
              </Button>
              <Button variant="secondary">
                How It Works
              </Button>
            </div>
          </div>

          {/* Right Image Grid */}
          <div className="grid grid-cols-2 gap-4 h-[600px]">
            {/* Large main image */}
            <div className="col-span-2 h-2/3">
              <ImageCard
                src="https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Aerial view of sustainable farmland"
                className="h-full"
                tags={mainTags.slice(0, 3)}
              />
            </div>
            
            {/* Bottom left - Community stats */}
            <div className="h-1/3">
              <ImageCard
                src="https://images.pexels.com/photos/2889441/pexels-photo-2889441.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Community of farmers"
                className="h-full"
                overlay={
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                    <div className="text-2xl font-bold text-green-600">100k+</div>
                    <div className="text-sm text-gray-700 font-medium">people joined</div>
                  </div>
                }
              />
            </div>
            
            {/* Bottom right - Call to action */}
            <div className="h-1/3">
              <ImageCard
                src="https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Farmer working in field"
                className="h-full"
                overlay={
                  <div className="bg-gradient-to-r from-green-600/95 to-emerald-600/95 backdrop-blur-sm rounded-lg p-4 shadow-lg text-white">
                    <div className="text-sm font-semibold leading-tight">
                      Join us in transforming the future of farming.
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};