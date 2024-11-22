import React from 'react';
import { combineClasses } from '@/utils/combineClasses';

interface CarouselProps {
  className?: string;
  children?: React.ReactNode;
}

export const Carousel: React.FC<CarouselProps> = ({ className, children, ...props }) => {
  return (
    <div className={combineClasses(className, 'cf-carousel')} {...props}>
      {children}
    </div>
  );
};
