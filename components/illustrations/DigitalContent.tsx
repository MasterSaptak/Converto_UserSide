import React from 'react';
import { BaseIllustration } from './BaseIllustration';
import type { IllustrationProps } from './types';

export const DigitalContentIllustration: React.FC<IllustrationProps> = ({ 
  size = 120, 
  className = '', 
  accent = '#10B981',
  animated = false 
}) => {
  return (
    <BaseIllustration
      size={size}
      className={className}
    >
      {/* Background decoration */}
      <circle cx="50" cy="50" r="38" fill={accent} fillOpacity="0.1" />
      <rect x="25" y="25" width="50" height="50" rx="12" fill={accent} fillOpacity="0.15" />
      
      {/* Main Screen/Tablet */}
      <rect x="20" y="20" width="60" height="60" rx="8" fill="var(--background)" stroke="var(--foreground)" strokeWidth="3" />
      
      {/* Screen Inner */}
      <rect x="26" y="26" width="48" height="38" rx="4" fill="var(--foreground)" fillOpacity="0.05" />
      
      {/* Play/App Icon */}
      <circle cx="50" cy="45" r="12" fill="var(--background)" stroke={accent} strokeWidth="3" />
      <polygon points="46,39 57,45 46,51" fill={accent} />
      
      {/* Bottom Bar */}
      <rect x="26" y="68" width="48" height="6" rx="3" fill="var(--foreground)" fillOpacity="0.1" />
      <rect x="42" y="68" width="16" height="6" rx="3" fill={accent} />
      
      {/* Floating Elements (animated if true) */}
      <g className={animated ? 'animate-bounce' : ''} style={{ animationDuration: '3s' }}>
        <circle cx="75" cy="25" r="4" fill="var(--foreground)" />
        <circle cx="25" cy="75" r="4" fill={accent} />
      </g>
    </BaseIllustration>
  );
};
