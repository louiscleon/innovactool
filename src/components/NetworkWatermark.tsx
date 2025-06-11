import Image from 'next/image';

interface NetworkWatermarkProps {
  opacity?: number;
  className?: string;
}

export function NetworkWatermark({ opacity = 0.05, className = '' }: NetworkWatermarkProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      <div className="absolute -right-20 -bottom-20 transform rotate-12">
        <Image 
          src="/network-graph.svg" 
          alt="Network Background" 
          width={500} 
          height={500}
          className="opacity-[var(--opacity)]"
          style={{ '--opacity': opacity } as React.CSSProperties}
        />
      </div>
    </div>
  );
} 