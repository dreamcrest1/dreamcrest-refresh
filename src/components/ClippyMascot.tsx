import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveContent, ContentItem, ContentType } from '@/hooks/useLiveContent';
import { Sparkles, MessageCircle, Brain, Lightbulb, Quote, Zap, Smile } from 'lucide-react';

type Expression = 'happy' | 'excited' | 'thinking' | 'surprised' | 'winking' | 'amazed' | 'cool' | 'sleepy';

const expressionForType: Record<ContentType, Expression> = {
  quote: 'cool',
  trivia: 'thinking',
  fact: 'surprised',
  joke: 'excited',
  tech: 'amazed',
  greeting: 'happy',
};

const iconForType: Record<ContentType, React.ReactNode> = {
  quote: <Quote className="h-3 w-3" />,
  trivia: <Brain className="h-3 w-3" />,
  fact: <Lightbulb className="h-3 w-3" />,
  joke: <Smile className="h-3 w-3" />,
  tech: <Zap className="h-3 w-3" />,
  greeting: <Sparkles className="h-3 w-3" />,
};

export function ClippyMascot() {
  const [isMinimized, setIsMinimized] = useState(true);
  const [expression, setExpression] = useState<Expression>('happy');
  const [content, setContent] = useState<ContentItem | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const mascotRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout>();
  
  const { getContent, getGreeting, isLoading } = useLiveContent();

  // Show greeting on mount
  useEffect(() => {
    const greeting = getGreeting();
    setContent(greeting);
    setExpression('happy');
    
    const timer = setTimeout(() => {
      setIsMinimized(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [getGreeting]);

  // Hide hint after first interaction
  useEffect(() => {
    if (!isMinimized) {
      setShowHint(false);
    }
  }, [isMinimized]);

  // Eye tracking on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (mascotRef.current) {
        const rect = mascotRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        const maxOffset = 3;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normalizedX = (deltaX / distance) * Math.min(maxOffset, distance / 50);
        const normalizedY = (deltaY / distance) * Math.min(maxOffset, distance / 50);
        
        setEyeOffset({ 
          x: isNaN(normalizedX) ? 0 : normalizedX, 
          y: isNaN(normalizedY) ? 0 : normalizedY 
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Idle timer for auto-content
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = setTimeout(async () => {
        if (isMinimized) {
          const newContent = await getContent();
          setContent(newContent);
          setExpression(expressionForType[newContent.type]);
          setIsMinimized(false);
        }
      }, 45000);
    };

    resetIdleTimer();
    window.addEventListener('click', resetIdleTimer);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('click', resetIdleTimer);
    };
  }, [isMinimized, getContent]);

  // Handle click
  const handleClick = useCallback(async () => {
    if (isMinimized) {
      setIsMinimized(false);
      return;
    }
    
    const newContent = await getContent();
    setContent(newContent);
    setExpression(expressionForType[newContent.type]);
  }, [isMinimized, getContent]);

  // Handle double click - celebration
  const handleDoubleClick = useCallback(() => {
    setIsCelebrating(true);
    setExpression('excited');
    setTimeout(() => {
      setIsCelebrating(false);
      setExpression('happy');
    }, 2000);
  }, []);

  // Close bubble
  const handleClose = useCallback(() => {
    setIsMinimized(true);
  }, []);

  // Get eyebrow style based on expression
  const getEyebrowStyle = (expr: Expression) => {
    switch (expr) {
      case 'thinking': return { left: -8, right: 8 };
      case 'surprised': return { left: -12, right: -12 };
      case 'excited': return { left: -5, right: -5 };
      case 'amazed': return { left: -10, right: -10 };
      default: return { left: 0, right: 0 };
    }
  };

  const eyebrows = getEyebrowStyle(expression);

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3">
      {/* Speech Bubble */}
      <AnimatePresence>
        {!isMinimized && content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="relative max-w-xs sm:max-w-sm"
          >
            {/* Paper background effect */}
            <div className="absolute -inset-2 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 rounded-lg transform rotate-2 shadow-lg" />
            <div className="absolute -inset-2 bg-gradient-to-br from-amber-50 to-white dark:from-amber-800/20 dark:to-card rounded-lg transform -rotate-1 shadow-md" />
            
            <div className="relative glass rounded-xl p-4 shadow-lg border-2 border-primary/30 bg-card/95">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-bold text-primary font-display">
                    {iconForType[content.type]}
                    {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                  </span>
                  {content.isLive && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-500 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-bold"
                >
                  ✕
                </button>
              </div>
              
              {/* Content */}
              <p className="text-sm leading-relaxed text-foreground font-medium">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      📎
                    </motion.span>
                    Let me find something cool...
                  </span>
                ) : (
                  content.text
                )}
              </p>
              
              {/* Source */}
              {content.source && (
                <p className="text-[10px] text-muted-foreground mt-2 opacity-60 font-medium">
                  via {content.source}
                </p>
              )}
            </div>
            
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-card/95 rotate-45 border-r-2 border-b-2 border-primary/30" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clippy Character */}
      <motion.div
        ref={mascotRef}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className="relative cursor-pointer select-none"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={isCelebrating ? {
          y: [0, -15, 0],
          rotate: [0, -10, 10, -10, 0],
        } : {
          y: [0, -5, 0],
        }}
        transition={isCelebrating ? {
          duration: 0.4,
          repeat: 4,
        } : {
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)',
            transform: 'scale(1.5)',
          }}
          animate={{
            scale: [1.5, 1.8, 1.5],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Paper stack behind clippy */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 -z-10">
          <motion.div 
            className="w-14 h-16 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/30 rounded-sm shadow-md transform rotate-6"
            animate={{ rotate: [6, 8, 6] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-1 left-1 w-14 h-16 bg-gradient-to-br from-white to-amber-50 dark:from-card dark:to-amber-900/20 rounded-sm shadow-lg transform -rotate-3"
            animate={{ rotate: [-3, -5, -3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            {/* Paper lines */}
            <div className="mt-3 mx-2 space-y-1.5">
              <div className="h-0.5 bg-muted-foreground/20 rounded" />
              <div className="h-0.5 bg-muted-foreground/20 rounded w-4/5" />
              <div className="h-0.5 bg-muted-foreground/20 rounded w-3/5" />
              <div className="h-0.5 bg-muted-foreground/20 rounded w-4/5" />
            </div>
          </motion.div>
        </div>

        {/* Clippy SVG */}
        <svg
          width="80"
          height="100"
          viewBox="0 0 80 100"
          className="relative z-10 drop-shadow-xl"
        >
          {/* Definitions */}
          <defs>
            {/* Metallic gradient for paperclip */}
            <linearGradient id="clipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="30%" stopColor="hsl(var(--secondary))" />
              <stop offset="60%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </linearGradient>
            
            {/* Shine effect */}
            <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="clipGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Paperclip body - main loop */}
          <motion.path
            d="M25 95 
               L25 30 
               Q25 10 40 10 
               Q55 10 55 30 
               L55 75 
               Q55 85 45 85 
               Q35 85 35 75 
               L35 35
               Q35 28 40 28
               Q45 28 45 35
               L45 65"
            fill="none"
            stroke="url(#clipGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#clipGlow)"
            animate={isCelebrating ? {
              strokeWidth: [8, 10, 8],
            } : {}}
          />
          
          {/* Shine overlay */}
          <motion.path
            d="M25 95 
               L25 30 
               Q25 10 40 10 
               Q55 10 55 30 
               L55 75 
               Q55 85 45 85 
               Q35 85 35 75 
               L35 35
               Q35 28 40 28
               Q45 28 45 35
               L45 65"
            fill="none"
            stroke="url(#shineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Face container - positioned at the top bend */}
          <g transform="translate(40, 22)">
            {/* Left eyebrow */}
            <motion.line
              x1="-10"
              y1="-8"
              x2="-4"
              y2="-6"
              stroke="hsl(var(--foreground))"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ rotate: eyebrows.left }}
              style={{ transformOrigin: '-7px -7px' }}
            />
            
            {/* Right eyebrow */}
            <motion.line
              x1="4"
              y1="-6"
              x2="10"
              y2="-8"
              stroke="hsl(var(--foreground))"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ rotate: eyebrows.right }}
              style={{ transformOrigin: '7px -7px' }}
            />

            {/* Left eye */}
            <motion.g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
              <circle
                cx="-8"
                cy="0"
                r="6"
                fill="white"
                stroke="hsl(var(--foreground))"
                strokeWidth="1.5"
              />
              <motion.circle
                cx="-8"
                cy="0"
                r="3"
                fill="hsl(var(--foreground))"
                animate={expression === 'winking' ? { scaleY: [1, 0.1, 1] } : {}}
                transition={{ duration: 0.2 }}
              />
              {/* Eye shine */}
              <circle cx="-9" cy="-2" r="1.5" fill="white" />
            </motion.g>
            
            {/* Right eye */}
            <motion.g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
              <circle
                cx="8"
                cy="0"
                r="6"
                fill="white"
                stroke="hsl(var(--foreground))"
                strokeWidth="1.5"
              />
              <motion.circle
                cx="8"
                cy="0"
                r="3"
                fill="hsl(var(--foreground))"
                animate={expression === 'sleepy' ? { scaleY: [1, 0.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Eye shine */}
              <circle cx="7" cy="-2" r="1.5" fill="white" />
            </motion.g>

            {/* Blink animation overlay */}
            <motion.g
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ 
                duration: 0.15, 
                repeat: Infinity, 
                repeatDelay: 4,
                times: [0, 0.5, 1]
              }}
              style={{ transformOrigin: '0 0' }}
            >
              <rect x="-14" y="-6" width="12" height="12" fill="hsl(var(--primary))" rx="6" />
              <rect x="2" y="-6" width="12" height="12" fill="hsl(var(--primary))" rx="6" />
            </motion.g>
          </g>
        </svg>

        {/* Click hint */}
        <AnimatePresence>
          {showHint && isMinimized && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <span className="text-xs font-bold bg-card/90 backdrop-blur px-3 py-1.5 rounded-full border-2 border-primary/30 shadow-lg font-display">
                Click me! 📎
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification dot */}
        {isMinimized && (
          <motion.div
            className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary shadow-lg"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
