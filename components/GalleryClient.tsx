'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, useSpring, motion } from 'framer-motion';

export default function GalleryClient({ images }: { images: string[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    const smoothProgress = useSpring(scrollYProgress, springConfig);

    // Parallax speed controls
    const outerColumnsSpeed = -900; // Columns 1 & 3 (negative = move up when scrolling down)
    const middleColumnSpeed = 150;   // Column 2 (positive = move down when scrolling down)

    const y1 = useTransform(smoothProgress, [0, 1], [0, isMobile ? 0 : outerColumnsSpeed]);
    const y2 = useTransform(smoothProgress, [0, 1], [0, isMobile ? 0 : middleColumnSpeed]);
    const y3 = useTransform(smoothProgress, [0, 1], [0, isMobile ? 0 : outerColumnsSpeed]);

    // Inner image parallax (opposite direction to columns for revealing window effect)
    // Columns 1 & 3 move UP, so images move DOWN (10% to -10%)
    const innerY1 = useSpring(
        useTransform(smoothProgress, [0, 1], isMobile ? [0, 0] : ['10%', '-10%']),
        springConfig
    );
    const innerY3 = useSpring(
        useTransform(smoothProgress, [0, 1], isMobile ? [0, 0] : ['10%', '-10%']),
        springConfig
    );
    // Column 2 moves DOWN, so images move UP (-10% to 10%)
    const innerY2 = useSpring(
        useTransform(smoothProgress, [0, 1], isMobile ? [0, 0] : ['-10%', '10%']),
        springConfig
    );

    // Distribute images into 3 columns
    const columns = [[], [], []] as string[][];
    images.forEach((src, i) => {
        columns[i % 3].push(src);
    });

    return (
        <div className="w-full bg-black">
            <div ref={containerRef} className="w-full max-w-[1920px] mx-auto px-4 h-[380vh] relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 h-full overflow-hidden">
                    {[y1, y2, y3].map((y, colIndex) => {
                        const innerYTransforms = [innerY1, innerY2, innerY3];
                        return (
                            <div key={colIndex} className="relative overflow-hidden h-full">
                                <motion.div style={{ y }} className="flex flex-col gap-3">
                                    {columns[colIndex].map((src, index) => (
                                        <motion.div
                                            key={index}
                                            className="relative group overflow-hidden bg-zinc-900"
                                        >
                                            <motion.div
                                                style={{
                                                    y: innerYTransforms[colIndex],
                                                    scale: 1.1
                                                }}
                                            >
                                                <Image
                                                    src={src}
                                                    alt={`Gallery Image`}
                                                    width={800}
                                                    height={600}
                                                    className="w-full h-auto object-cover"
                                                    loading="lazy"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </motion.div>

                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
