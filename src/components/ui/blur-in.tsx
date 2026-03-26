'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BlurInProps {
  children?: React.ReactNode;
  word?: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function BlurIn({ children, word, className, delay = 0, duration = 0.6 }: BlurInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(12px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={cn(className)}
    >
      {word ?? children}
    </motion.div>
  );
}
