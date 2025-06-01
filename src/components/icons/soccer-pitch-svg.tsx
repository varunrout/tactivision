import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

interface SoccerPitchSVGProps extends SVGProps<SVGSVGElement> {
  // You can add specific props for pins, heatmaps, etc. later
}

const SoccerPitchSVG = ({ className, ...props }: SoccerPitchSVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1050 680" // Standard pitch dimensions (e.g., 105m x 68m scaled)
    className={cn("w-full h-auto bg-green-600/10 rounded-md border border-green-600/30", className)}
    {...props}
    data-ai-hint="soccer field"
  >
    {/* Pitch Outline */}
    <rect x="5" y="5" width="1040" height="670" fill="transparent" stroke="hsl(var(--foreground))" strokeOpacity="0.5" strokeWidth="3" />
    {/* Center Line */}
    <line x1="525" y1="5" x2="525" y2="675" stroke="hsl(var(--foreground))" strokeOpacity="0.5" strokeWidth="3" />
    {/* Center Circle */}
    <circle cx="525" cy="340" r="91.5" fill="transparent" stroke="hsl(var(--foreground))" strokeOpacity="0.5" strokeWidth="3" />
    {/* Center Spot */}
    <circle cx="525" cy="340" r="5" fill="hsl(var(--foreground))" fillOpacity="0.5" />

    {/* Left Penalty Area */}
    <rect x="5" y="138.5" width="165" height="403" fill="transparent" stroke="hsl(var(--foreground))" strokeOpacity="0.5" strokeWidth="3" />
    {/* Left Goal Area */}
    <rect x="5" y="248.5" width="55" height="183" fill="transparent" stroke="hsl(var(--foreground))" strokeOpacity="0.5" strokeWidth="3" />
    {/* Left Penalty Spot */}
    <circle cx="115" cy="340" r="5" fill="hsl(var(--foreground))" fillOpacity="0.5" />
    {/* Left Penalty Arc */}
    <path d="M 165 248.5 A 91.5 91.5 0 0 1 165 431.5" fill="transparent" stroke="hsl(var(--foreground))" strokeOpacity="0.5" strokeWidth="3" />

    {/* Right Penalty Area */}
    <rect x="880" y="138.5" width="165" height="403" fill="transparent" stroke="hsl(var(--foreground))" strokeOpacity="0.5" strokeWidth="3" />
    {/* Right Goal Area */}
    <rect x="990" y="248.5" width="55" height="183" fill="transparent" stroke="hsl(var(--foreground))" strokeOpacity="0.5" strokeWidth="3" />
    {/* Right Penalty Spot */}
    <circle cx="935" cy="340" r="5" fill="hsl(var(--foreground))" fillOpacity="0.5" />
    {/* Right Penalty Arc */}
    <path d="M 880 248.5 A 91.5 91.5 0 0 0 880 431.5" fill="transparent" stroke="hsl(var(--foreground))" strokeOpacity="0.5" strokeWidth="3" />

    {/* Goals (simplified) */}
    <rect x="0" y="304" width="5" height="72" fill="hsl(var(--foreground))" fillOpacity="0.3" />
    <rect x="1045" y="304" width="5" height="72" fill="hsl(var(--foreground))" fillOpacity="0.3" />

    {/* You can add children here to plot shots, player positions, etc. */}
    {props.children}
  </svg>
);

export default SoccerPitchSVG;
