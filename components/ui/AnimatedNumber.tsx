'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export function AnimatedNumber({ value }: { value: number }) {
  const [hasMounted, setHasMounted] = useState(false);
  
  // Spring config for a smooth, punchy brutalist animation
  const spring = useSpring(value, {
    mass: 0.8,
    stiffness: 75,
    damping: 15
  });

  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  if (!hasMounted) {
    return <span>{value.toLocaleString()}</span>;
  }

  return <motion.span>{display}</motion.span>;
}
