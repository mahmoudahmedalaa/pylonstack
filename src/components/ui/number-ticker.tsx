'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NumberTickerProps {
  value: number;
  className?: string;
  delay?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function NumberTicker({
  value,
  className,
  delay = 0,
  duration = 1.5,
  prefix = '',
  suffix = '',
  decimals = 0,
}: NumberTickerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = (currentTime - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(eased * value);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, value, duration, delay]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      className={cn('tabular-nums', className)}
    >
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
}
