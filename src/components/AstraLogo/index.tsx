
import React from 'react';
import CentralLogo from './CentralLogo';
import BrandFrame from './BrandFrame';
import BrandElements from './BrandElements';
import SVGDefinitions from './SVGDefinitions';

interface AstraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const AstraLogo = ({ className = '', size = 'md' }: AstraLogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <SVGDefinitions />
        <BrandFrame />
        <BrandElements />
        <CentralLogo />
      </svg>
    </div>
  );
};

export default AstraLogo;
