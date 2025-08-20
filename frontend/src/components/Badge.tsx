import React from 'react';
import { Leaf } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200';
  const variantClasses = {
    default: 'bg-green-50 text-green-700 border border-green-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <Leaf className="w-3 h-3" />
      {children}
    </div>
  );
};