'use client';
import { cn } from '@/utils/cn';
import React, { type CSSProperties } from 'react';

interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = '#26B0BC',
      shimmerSize = '0.1em',
      shimmerDuration = '1.5s',
      borderRadius = '100px',
      background = '#75FA8D',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            '--spread': '90deg',
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--cut': shimmerSize,
            '--bg': background,
          } as CSSProperties
        }
        className={cn(
          'group relative cursor-pointer overflow-hidden whitespace-nowrap px-6 py-3 text-brand-tertiary [background:var(--bg)] [border-radius:var(--radius)] ',
          'shadow-brand transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md',
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div className="absolute inset-0 overflow-visible [container-type:size]">
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] animate-slide [aspect-ratio:1] [border-radius:0] [mask:none] ">
            {/* spark before */}
            <div className="absolute inset-[-100%] w-auto rotate-0 animate-shimmer-spin [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,hsl(0_0%_100%/1)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>

        {/* backdrop */}
        <div className="absolute [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]" />
        {/* content */}

        <div className="pointer-events-none relative z-10 flex text-white dark:text-black">
          {children}
        </div>
      </button>
    );
  },
);

ShimmerButton.displayName = 'ShimmerButton';

export default ShimmerButton;
