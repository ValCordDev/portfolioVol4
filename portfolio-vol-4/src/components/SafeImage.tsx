'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  onClick?: () => void;
}

export default function SafeImage({ 
  src, 
  alt, 
  className = '', 
  fill = false, 
  width, 
  height, 
  sizes, 
  priority = false,
  onClick 
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false);
  const [useNextImage, setUseNextImage] = useState(true);

  // Check if the image is from a known optimizable source
  const isOptimizable = src.includes('firebasestorage.googleapis.com') || 
                       src.includes('googleapis.com') ||
                       src.startsWith('/') ||
                       src.includes('imgur.com');

  const handleImageError = () => {
    setImageError(true);
    setUseNextImage(false);
  };

  // If we've had an error or the image is not optimizable, use regular img
  if (!useNextImage || imageError || !isOptimizable) {
    return (
      <Image
        src={imageError ? '/placeholder-image.svg' : src}
        alt={alt}
        className={`${className} ${imageError ? 'opacity-50' : ''}`}
        fill={fill}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        unoptimized={true}
        onClick={onClick}
        onError={() => {
          if (!imageError) {
            setImageError(true);
          }
        }}
        style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {}}
      />
    );
  }

  // Use Next.js Image with error handling
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={!isOptimizable}
      onClick={onClick}
      onError={handleImageError}
    />
  );
}