'use client';

import { useState, useEffect } from 'react';

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  defaultMin?: number;
  defaultMax?: number;
  step?: number;
  onChange: (min: number, max: number) => void;
}

export default function PriceRangeSlider({
  min = 0,
  max = 1000000,
  defaultMin = 0,
  defaultMax = 1000000,
  step = 10000,
  onChange,
}: PriceRangeSliderProps) {
  const [minValue, setMinValue] = useState(defaultMin);
  const [maxValue, setMaxValue] = useState(defaultMax);

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    if (price >= 1000) {
      return `₹${(price / 1000).toFixed(0)}K`;
    }
    return `₹${price}`;
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= maxValue) {
      setMinValue(value);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= minValue) {
      setMaxValue(value);
    }
  };

  const handleMouseUp = () => {
    onChange(minValue, maxValue);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {formatPrice(minValue)}
        </span>
        <span className="text-sm text-gray-500">-</span>
        <span className="text-sm font-medium text-gray-700">
          {formatPrice(maxValue)}
        </span>
      </div>

      <div className="relative pt-1">
        {/* Min Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-20"
          style={{
            WebkitAppearance: 'none',
          }}
        />

        {/* Max Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-20"
          style={{
            WebkitAppearance: 'none',
          }}
        />

        {/* Track */}
        <div className="relative w-full h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-2 bg-blue-600 rounded-full"
            style={{
              left: `${(minValue / max) * 100}%`,
              right: `${100 - (maxValue / max) * 100}%`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          pointer-events: all;
          position: relative;
          z-index: 30;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          pointer-events: all;
          position: relative;
          z-index: 30;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
