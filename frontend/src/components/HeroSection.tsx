import React, { useState } from 'react';
import { Leaf, ArrowRight, Lightbulb} from 'lucide-react';

import { Badge } from './Badge';
import { Button } from './Button';
import { ImageCard } from './ImageCard';


export const HeroSection: React.FC = () => {
    const [swapped, setSwapped] = useState(false);

  const mainTags = [
    'Innovative Agriculture',
    'Sustainable Farming',
    'Eco-friendly Solutions',
    'Future of Farming',
    'Green Technology'
  ];


  return (
    <section className="min-h-screen bg-gradient-to-b from green-50 via-green-100 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <Badge variant="success">
              Empowering Modern Agriculture
            </Badge>
            
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
               Empowering  {' '} <br />
               <div className='flex items-center gap-2'>
                 <span className="inline-flex items-center gap-2">
                  farmers with 

                </span>
     
      <span className="flex items-center space-x-0 relative overflow-hidden">

        <div className="relative w-14 h-14 rounded-full border-2 border-green-600 animate-slideLeft flex items-center justify-center">
        </div>

        {/* Leaf Icon */}
        <div className="relative w-14 h-14 rounded-full bg-green-600 text-white animate-slideRight flex items-center justify-center">
          <Leaf className="w-7 h-7" />
        </div>
      </span>

      {/* Custom Animation Styles */}
      <style >{`
        @keyframes slideLeft {
          0% { transform: translateX(0); background-color: transparent; }
          50% { transform: translateX(3.5rem); background-color: #16a34a; } /* green-600 */
          100% { transform: translateX(0); background-color: transparent; }
        }

        @keyframes slideRight {
          0% { transform: translateX(0); background-color: #16a34a; }
          50% { transform: translateX(-3.5rem); background-color: transparent; color: #16a34a; }
          100% { transform: translateX(0); background-color: #16a34a; color: white; }
        }

        .animate-slideLeft {
          animation: slideLeft 3s infinite ease-in-out;
        }

        .animate-slideRight {
          animation: slideRight 3s infinite ease-in-out;
        }
      `}</style>
               </div>
easy financing              </h1>
              
             <p>
  Connects verified farmers with investors, ensures milestone-based funding, and builds trust through ratings and transparent progress tracking.
</p>

            </div>
            
           <div className="flex flex-col sm:flex-row gap-4">
  {/* Get Started Today Button */}
    <button className="relative overflow-hidden  bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 text-white px-8 py-3 rounded-full transition-all duration-500 flex items-center justify-between space-x-3 group shadow-lg">
      {/* Glow effect */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-300 opacity-50 blur-2xl group-hover:opacity-80 group-hover:blur-3xl transition-all duration-700"></span>
      {/* Shine overlay */}
      <span className="absolute -left-20 top-0 h-full w-20 bg-white/20 rotate-12 group-hover:left-[130%] transition-all duration-700 ease-in-out"></span>

      <span className="relative z-10 font-semibold tracking-wide group-hover:tracking-wider transition-all duration-500">
        Get Started Today
      </span>

      {/* Arrow in Circle */}
      <div className="relative z-10 bg-white rounded-full p-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
        <ArrowRight
          size={22}
          className="text-green-600 group-hover:translate-x-1 transition-transform duration-500"
        />
      </div>
    </button>

  {/* How It Works Button */}
  <a
    href="#"
    className="group flex items-center relative py-3 px-6 rounded-full bg-green-600/10 hover:bg-green-600/20 transition-all duration-500 ease-in-out shadow-md"
  >
    <div className="flex items-center">
      <div className="bg-green-600 p-2 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
        <Lightbulb
          size={20}
          className="text-white transition-all duration-500"
        />
      </div>
      <span className="ml-3 font-medium text-green-800 group-hover:text-green-900 transition-colors duration-500">
        How it works
      </span>
    </div>
  </a>
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