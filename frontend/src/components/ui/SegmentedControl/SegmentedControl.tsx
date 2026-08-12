import React, { useEffect, useRef, useState } from 'react';
import './SegmentedControl.css';

interface SegmentedControlProps {
  options: string[];
  activeOption: string;
  onChange: (option: string) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, activeOption, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const updateIndicator = () => {
      if (!containerRef.current) return;
      
      const activeIndex = options.indexOf(activeOption);
      if (activeIndex === -1) return;

      const tabs = containerRef.current.querySelectorAll('[role="tab"]');
      const activeTab = tabs[activeIndex] as HTMLElement;

      if (activeTab) {
        setIndicatorStyle({
          left: activeTab.offsetLeft,
          width: activeTab.offsetWidth
        });
      }
    };

    updateIndicator();
    
    const observer = new ResizeObserver(updateIndicator);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [activeOption, options]);

  return (
    <div 
      className="kali-segmented-control" 
      ref={containerRef}
      role="tablist"
    >
      <div 
        className="kali-segmented-indicator"
        style={{ left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px` }}
      />
      {options.map(option => (
        <button
          key={option}
          role="tab"
          aria-selected={activeOption === option}
          className={`kali-segmented-btn ${activeOption === option ? 'active' : ''}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
