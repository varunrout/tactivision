import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  // For a real SVG logo, replace this with the actual SVG path data
  // This is a text placeholder for now
  <div className="font-headline text-2xl font-bold tracking-tight text-primary-foreground group-hover:text-accent transition-colors duration-200" style={{ lineHeight: '1' }}>
    TactiVision
  </div>
);

export default Logo;
