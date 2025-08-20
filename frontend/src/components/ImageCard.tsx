import React from 'react';

interface ImageCardProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: React.ReactNode;
  tags?: string[];
}

export const ImageCard: React.FC<ImageCardProps> = ({ 
  src, 
  alt, 
  className = '',
  overlay,
  tags = []
}) => {
  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
      />
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      
      {/* Tags */}
      {tags.length > 0 && (
        <div className="absolute top-4 left-4 right-4 space-y-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="inline-block bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm mr-2 mb-2"
            >
              {tag}
            </div>
          ))}
        </div>
      )}
      
      {/* Custom overlay content */}
      {overlay && (
        <div className="absolute bottom-4 left-4 right-4">
          {overlay}
        </div>
      )}
    </div>
  );
};