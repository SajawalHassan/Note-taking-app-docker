import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AppLayout({ children, className = '' }: AppLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 ${className}`}
    >
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {children}
      </div>
    </motion.div>
  );
}