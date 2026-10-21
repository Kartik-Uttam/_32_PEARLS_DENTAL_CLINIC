import React from 'react';
import { motion } from 'motion/react';

interface AnimatedToothProps {
  className?: string;
  size?: number;
  variant?: 'floating-pearl' | 'minimal-outline' | 'badge' | 'ambient-cluster' | 'sparkle-duo';
  delay?: number;
  showSparkles?: boolean;
  interactive?: boolean;
  label?: string;
}

export const AnimatedTooth: React.FC<AnimatedToothProps> = ({
  className = '',
  size = 56,
  variant = 'floating-pearl',
  delay = 0,
  showSparkles = true,
  interactive = true,
  label,
}) => {
  // Tooth SVG Path matching the iconic 32 Pearls dental silhouette
  // Smooth crown, bilateral cusps, gentle cingulum groove, and dual tapering roots
  const toothPath =
    'M20 7C16 6 12 3 8 6C2 10 5 19 7 24C9 30 9 37 13 37C16 37 15 26 20 26C25 26 24 37 27 37C31 37 31 30 33 24C35 19 38 10 32 6C28 3 24 6 20 7Z';
  const groovePath = 'M14 11C17 12 20 15 25 14';

  if (variant === 'sparkle-duo') {
    return (
      <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
        {/* Main Floating Tooth */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay,
          }}
          whileHover={interactive ? { scale: 1.08, rotate: 6 } : undefined}
          className="relative filter drop-shadow-md cursor-pointer"
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 40 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            <defs>
              <linearGradient id={`pearl-grad-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#eaf5f4" />
                <stop offset="100%" stopColor="#d1ede9" />
              </linearGradient>
              <linearGradient id={`gleam-grad-${delay}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Tooth Body with pearly gradient */}
            <path
              d={toothPath}
              fill={`url(#pearl-grad-${delay})`}
              stroke="#137d81"
              strokeWidth="1.75"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Occlusal smile crease */}
            <path
              d={groovePath}
              stroke="#137d81"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.65"
            />

            {/* Subtle Enamel Highlight Arc */}
            <path
              d="M10 10C8 14 9 20 10 24"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>

          {/* Twinkling Sparkle 1 */}
          {showSparkles && (
            <>
              <motion.div
                animate={{
                  scale: [0.6, 1.2, 0.6],
                  opacity: [0.3, 1, 0.3],
                  rotate: [0, 90, 180],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: delay + 0.3,
                }}
                className="absolute -top-1 -right-1 text-teal-600"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
              </motion.div>

              <motion.div
                animate={{
                  scale: [0.8, 0.4, 0.8],
                  opacity: [0.8, 0.2, 0.8],
                  rotate: [45, 135, 225],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: delay + 1.2,
                }}
                className="absolute -bottom-1 -left-2 text-teal-400"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Optional Subtext badge */}
        {label && (
          <span className="mt-2 text-[10px] font-semibold text-teal-800 tracking-wider uppercase bg-teal-50/80 px-2.5 py-0.5 rounded-full border border-teal-200/60 backdrop-blur-xs">
            {label}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        }}
        whileHover={interactive ? { scale: 1.05, y: -8 } : undefined}
        className={`inline-flex items-center gap-2.5 px-3.5 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-teal-100 shadow-sm shadow-teal-900/5 select-none ${className}`}
      >
        <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-200/50 text-teal-700">
          <svg width="20" height="22" viewBox="0 0 40 44" fill="currentColor">
            <path d={toothPath} />
          </svg>
        </div>
        {label && (
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-slate-800 tracking-tight leading-none">{label}</span>
            <span className="text-[9px] text-teal-600 font-medium mt-0.5">Gentle & Care-focused</span>
          </div>
        )}
      </motion.div>
    );
  }

  if (variant === 'ambient-cluster') {
    return (
      <div className={`relative pointer-events-none select-none ${className}`}>
        {/* Primary Tooth */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [-3, 4, -3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay,
          }}
          className="relative opacity-60 hover:opacity-100 transition-opacity"
        >
          <svg width={size} height={size} viewBox="0 0 40 44" fill="none" className="text-teal-600">
            <path
              d={toothPath}
              fill="#ffffff"
              fillOpacity="0.8"
              stroke="#137d81"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d={groovePath} stroke="#137d81" strokeWidth="1.2" opacity="0.6" />
          </svg>
        </motion.div>

        {/* Small Companion Tooth */}
        <motion.div
          animate={{
            y: [0, 8, 0],
            rotate: [4, -5, 4],
          }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: delay + 1.5,
          }}
          className="absolute -top-3 -right-6 opacity-40"
        >
          <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 40 44" fill="none">
            <path
              d={toothPath}
              fill="#e6f5f3"
              stroke="#137d81"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    );
  }

  // Default 'floating-pearl'
  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      <motion.div
        animate={{
          y: [0, -9, 0],
          rotate: [-1.5, 2.5, -1.5],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        }}
        whileHover={interactive ? { scale: 1.1, rotate: [0, -5, 5, 0] } : undefined}
        className="relative cursor-pointer group"
        title="32 Pearls Gentle Dental Smile"
      >
        {/* Soft Radial Ambient Glow */}
        <div className="absolute inset-0 bg-teal-300/25 rounded-full blur-xl transform scale-125 pointer-events-none group-hover:bg-teal-400/40 transition-colors" />

        <svg
          width={size}
          height={size}
          viewBox="0 0 40 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 overflow-visible drop-shadow-sm transition-transform duration-300"
        >
          <defs>
            <linearGradient id={`tooth-pearl-${delay}`} x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f4faf8" />
              <stop offset="100%" stopColor="#d5eee9" />
            </linearGradient>
            <linearGradient id={`tooth-stroke-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#137d81" />
              <stop offset="100%" stopColor="#0d666b" />
            </linearGradient>
          </defs>

          {/* Tooth Geometry */}
          <path
            d={toothPath}
            fill={`url(#tooth-pearl-${delay})`}
            stroke={`url(#tooth-stroke-${delay})`}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Smile / Cingulum Groove */}
          <path
            d={groovePath}
            stroke="#137d81"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* Left Enamel Glint curve */}
          <path
            d="M10 9C7.5 13 8.5 20 10.5 24"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.95"
          />
        </svg>

        {/* Orbiting Sparkle Star */}
        {showSparkles && (
          <motion.div
            animate={{
              scale: [0.7, 1.25, 0.7],
              opacity: [0.35, 1, 0.35],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: delay + 0.5,
            }}
            className="absolute -top-1.5 -right-2 text-teal-600 pointer-events-none"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </motion.div>
        )}
      </motion.div>

      {label && (
        <span className="mt-2 text-[10px] font-semibold text-teal-800 tracking-wider uppercase bg-white/80 px-2.5 py-0.5 rounded-full border border-teal-200/60 shadow-xs">
          {label}
        </span>
      )}
    </div>
  );
};
