import React, { useState } from 'react';
import { StarIcon } from './Icons';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  size = 'md',
  className = '',
  onRate,
  readOnly = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = (rate: number) => {
    if (!readOnly && onRate) {
      onRate(rate);
    }
  };

  const handleMouseEnter = (rate: number) => {
    if (!readOnly) {
      setHoverRating(rate);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const currentRating = hoverRating || rating;

  return (
    <div
      className={`flex items-center gap-0.5 ${className}`}
      onMouseLeave={handleMouseLeave}
      aria-label={`Rating: ${rating.toFixed(1)} out of ${totalStars} stars`}
      role={readOnly ? 'img' : 'radiogroup'}
    >
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.floor(currentRating);
        const isHalf = starValue === Math.ceil(currentRating) && currentRating % 1 !== 0;

        return (
          <div
            key={starValue}
            className={`relative ${readOnly ? '' : 'cursor-pointer'}`}
            onClick={() => handleRate(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            role={readOnly ? undefined : 'radio'}
            aria-checked={!readOnly && starValue === rating}
            aria-label={`${starValue} star`}
          >
            <StarIcon className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600`} />
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: isFilled ? '100%' : isHalf ? '50%' : '0%' }}
            >
              <StarIcon className={`${sizeClasses[size]} text-yellow-400`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
