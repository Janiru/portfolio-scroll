'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis with studio-quality settings
        const lenis = new Lenis({
            lerp: 0.07, // Smooth interpolation factor (0.05 - 0.1 for weighted feel)
            duration: 1.3, // Scroll duration in seconds (1.2 - 1.5s for premium feel)
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.6, // Reduce scroll speed per wheel tick
            touchMultiplier: 1.5,
            infinite: false,
        });

        lenisRef.current = lenis;

        // Sync Lenis with requestAnimationFrame
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Cleanup on unmount
        return () => {
            lenis.destroy();
        };
    }, []);

    return <div className="lenis-wrapper">{children}</div>;
}
