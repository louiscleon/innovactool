import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Info } from 'lucide-react';

interface TooltipProps {
  text?: string;
  content?: string; // Alias pour 'text' pour assurer la compatibilité
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?: 'auto' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  clickable?: boolean;
  className?: string;
}

export function Tooltip({
  text,
  content,
  children,
  position = 'top',
  width = 'auto',
  icon = <Info size={16} />,
  clickable = false,
  className = '',
}: TooltipProps) {
  const tooltipText = text || content || '';
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  // Map width option to actual classes
  const widthClasses = {
    auto: 'w-auto max-w-xs',
    sm: 'w-40',
    md: 'w-64',
    lg: 'w-80',
  };

  // Update tooltip position based on trigger element position
  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = triggerRect.top - 8;
          left = triggerRect.left + triggerRect.width / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + triggerRect.width / 2;
          break;
        case 'left':
          top = triggerRect.top + triggerRect.height / 2;
          left = triggerRect.left - 8;
          break;
        case 'right':
          top = triggerRect.top + triggerRect.height / 2;
          left = triggerRect.right + 8;
          break;
      }

      setTooltipPosition({ top, left });
    }
  }, [isVisible, position]);

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isVisible && clickable) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, clickable]);

  // Handle tooltip toggle behavior
  const handleToggle = () => {
    if (clickable) {
      setIsVisible(!isVisible);
    }
  };

  // Tooltip component to be rendered in portal
  const TooltipContent = () => {
    if (!isVisible) return null;

    const getPositionStyles = () => {
      switch (position) {
        case 'top':
          return {
            transform: 'translate(-50%, -100%)',
          };
        case 'bottom':
          return {
            transform: 'translate(-50%, 0)',
          };
        case 'left':
          return {
            transform: 'translate(-100%, -50%)',
          };
        case 'right':
          return {
            transform: 'translate(0, -50%)',
          };
      }
    };

    const getArrowStyles = () => {
      switch (position) {
        case 'top':
          return 'bottom-[-4px] left-1/2 transform -translate-x-1/2 border-t-4 border-l-4 border-transparent border-l-transparent rotate-45 bg-gray-800';
        case 'bottom':
          return 'top-[-4px] left-1/2 transform -translate-x-1/2 border-b-4 border-r-4 border-transparent border-r-transparent rotate-45 bg-gray-800';
        case 'left':
          return 'right-[-4px] top-1/2 transform -translate-y-1/2 border-l-4 border-b-4 border-transparent border-b-transparent rotate-45 bg-gray-800';
        case 'right':
          return 'left-[-4px] top-1/2 transform -translate-y-1/2 border-r-4 border-t-4 border-transparent border-t-transparent rotate-45 bg-gray-800';
      }
    };

    return ReactDOM.createPortal(
      <div
        className={`fixed z-[9999] ${widthClasses[width]} bg-gray-800 text-white text-xs rounded shadow-lg p-2`}
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          ...getPositionStyles(),
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: tooltipText.replace(/\n/g, '<br>') }} />
        <div
          className={`absolute w-2 h-2 ${getArrowStyles()}`}
        />
      </div>,
      document.body
    );
  };

  return (
    <>
      <div
        className={`relative inline-flex items-center cursor-help ${className}`}
        onMouseEnter={() => !clickable && setIsVisible(true)}
        onMouseLeave={() => !clickable && setIsVisible(false)}
        onClick={handleToggle}
        ref={triggerRef}
      >
        {children || (
          <div className="p-1 text-gray-500 hover:text-primary-600 hover:bg-gray-50 rounded-full">
            {icon}
          </div>
        )}
      </div>
      <TooltipContent />
    </>
  );
}

export function InfoTooltip({ text, position = 'top', width = 'auto' }: Omit<TooltipProps, 'children' | 'icon'>) {
  return (
    <Tooltip text={text} position={position} width={width}>
      <div className="w-4 h-4 ml-1 flex items-center justify-center text-gray-400 hover:text-gray-600">
        <Info size={14} />
      </div>
    </Tooltip>
  );
} 