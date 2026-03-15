import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 2800);
      }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(hsl(142 71% 45% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(142 71% 45% / 0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="h-32 w-full scan-line"
          initial={{ y: '-100%' }}
          animate={{ y: '100vh' }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Shield icon */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 1, delay: 0.2 }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ boxShadow: '0 0 60px 20px hsl(142 71% 45% / 0.3)' }}
          />
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 glow-green">
            <Shield className="h-14 w-14 text-primary" strokeWidth={1.5} />
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="mb-2 font-heading text-4xl font-bold tracking-tight text-gradient-green"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        SpamGuard
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="mb-12 text-sm text-muted-foreground tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        Real-Time Protection Against Digital Fraud
      </motion.p>

      {/* Loading bar */}
      <motion.div
        className="w-48 h-1 rounded-full bg-secondary overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ delay: 1.4, duration: 1.2, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.p
        className="mt-4 font-mono text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 1] }}
        transition={{ delay: 1.4, duration: 1.2 }}
      >
        Initializing AI protection...
      </motion.p>
    </motion.div>
  );
};

export default SplashScreen;
