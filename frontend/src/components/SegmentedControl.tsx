import { useRef, useEffect, useState } from 'react';
import './SegmentedControl.css';

interface SegmentedControlProps {
  options: string[];
  activeOption: string;
  onChange: (option: string) => void;
}

export function SegmentedControl({ options, activeOption, onChange }: SegmentedControlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const activeIndex = options.indexOf(activeOption);
      if (activeIndex !== -1) {
        const activeItem = containerRef.current.children[activeIndex + 1] as HTMLElement; // +1 to skip slider div
        if (activeItem) {
          setSliderStyle({
            left: activeItem.offsetLeft,
            width: activeItem.offsetWidth,
          });
        }
      }
    }
  }, [activeOption, options]);

  return (
    <div className="segmented-control" ref={containerRef}>
      <div 
        className="segmented-slider" 
        style={{ left: `${sliderStyle.left}px`, width: `${sliderStyle.width}px` }} 
      />
      {options.map((option) => (
        <button
          key={option}
          className={`segmented-btn ${activeOption === option ? 'active' : ''}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
