import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import Navbar from './navbar';
import Link from 'next/link';
import { cn } from '@/utils/cn';
export default function Headers() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const changeBackground = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    document.addEventListener('scroll', changeBackground);

    return () => document.removeEventListener('scroll', changeBackground);
  }, []);

  return (
    <motion.header
      className={cn(
        'bg-background/30 shadow-xs fixed inset-x-0 top-4 z-40 mx-auto flex h-[60px] max-w-5xl items-center justify-between rounded-2xl px-8 saturate-100 backdrop-blur-[10px] transition-colors',
        isScrolled && 'bg-background/80'
      )}
      initial={{
        y: -100,
      }}
      animate={{
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <Link
        href="/"
        className="flex items-center justify-center gap-1"
        aria-label="home"
      >
        <span>Blog</span>
      </Link>
      <div className="flex items-center gap-2">
        <Navbar />
      </div>
    </motion.header>
  );
}
