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

export function CloudMascot() {
  const [isMinimized, setIsMinimized] = useState(true);
  const [expression, setExpression] = useState<Expression>('happy');
  const [content, setContent] = useState<ContentItem | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const sparkleIdRef = useRef(0);
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
      }, 45000); // Show content after 45s idle
    };

    resetIdleTimer();
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('click', resetIdleTimer);
    };
  }, [isMinimized, getContent]);

  // Create sparkle effect
  const createSparkle = useCallback(() => {
    const id = sparkleIdRef.current++;
    const x = Math.random() * 60 - 30;
    const y = Math.random() * 60 - 30;
    setSparkles(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== id));
    }, 1000);
  }, []);

  // Handle click
  const handleClick = useCallback(async () => {
    if (isMinimized) {
      setIsMinimized(false);
      return;
    }
    
    createSparkle();
    const newContent = await getContent();
    setContent(newContent);
    setExpression(expressionForType[newContent.type]);
  }, [isMinimized, getContent, createSparkle]);

  // Handle double click - celebration
  const handleDoubleClick = useCallback(() => {
    setIsCelebrating(true);
    setExpression('excited');
    for (let i = 0; i < 5; i++) {
      setTimeout(() => createSparkle(), i * 100);
    }
    setTimeout(() => {
      setIsCelebrating(false);
      setExpression('happy');
    }, 2000);
  }, [createSparkle]);

  // Close bubble
  const handleClose = useCallback(() => {
    setIsMinimized(true);
  }, []);

  // Eye positions based on expression
  const getEyes = (expr: Expression) => {
    switch (expr) {
      case 'happy':
        return { left: '◡', right: '◡', leftY: -2 };
      case 'excited':
        return { left: '★', right: '★', leftY: 0 };
      case 'thinking':
        return { left: '◔', right: '◔', leftY: 0 };
      case 'surprised':
        return { left: '◉', right: '◉', leftY: 0 };
      case 'winking':
        return { left: '◡', right: '◠', leftY: -2 };
      case 'amazed':
        return { left: '✧', right: '✧', leftY: 0 };
      case 'cool':
        return { left: '▬', right: '▬', leftY: 0 };
      case 'sleepy':
        return { left: '−', right: '−', leftY: 0 };
      default:
        return { left: '◡', right: '◡', leftY: -2 };
    }
  };

  const eyes = getEyes(expression);

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
            <div className="glass rounded-2xl p-4 shadow-lg border border-primary/20">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                    {iconForType[content.type]}
                    {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                  </span>
                  {content.isLive && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-500 text-[10px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
              
              {/* Content */}
              <p className="text-sm leading-relaxed text-foreground">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      ✨
                    </motion.span>
                    Fetching something cool...
                  </span>
                ) : (
                  content.text
                )}
              </p>
              
              {/* Source */}
              {content.source && (
                <p className="text-[10px] text-muted-foreground mt-2 opacity-60">
                  via {content.source}
                </p>
              )}
            </div>
            
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 glass rotate-45 border-r border-b border-primary/20" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cloud Character */}
      <motion.div
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className="relative cursor-pointer select-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isCelebrating ? {
          y: [0, -10, 0],
          rotate: [0, -5, 5, -5, 0],
        } : {
          y: [0, -6, 0],
        }}
        transition={isCelebrating ? {
          duration: 0.5,
          repeat: 3,
        } : {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Sparkles */}
        <AnimatePresence>
          {sparkles.map(sparkle => (
            <motion.div
              key={sparkle.id}
              initial={{ opacity: 1, scale: 0, x: 30, y: 30 }}
              animate={{ 
                opacity: 0, 
                scale: 1, 
                x: 30 + sparkle.x, 
                y: 30 + sparkle.y 
              }}
              exit={{ opacity: 0 }}
              className="absolute pointer-events-none text-yellow-400"
              style={{ fontSize: '16px' }}
            >
              ✨
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Cloud SVG */}
        <svg
          width="70"
          height="55"
          viewBox="0 0 70 55"
          className="relative z-10 drop-shadow-lg"
        >
          {/* Cloud gradient */}
          <defs>
            <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
              <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
            </linearGradient>
            <filter id="cloudShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="hsl(var(--primary))" floodOpacity="0.3" />
            </filter>
          </defs>
          
          {/* Cloud body */}
          <motion.path
            d="M55 35 C65 35 70 28 65 20 C60 12 50 12 45 15 C42 5 30 0 20 8 C10 16 10 28 20 35 C25 40 35 42 45 40 C50 38 55 37 55 35 Z"
            fill="url(#cloudGradient)"
            filter="url(#cloudShadow)"
            animate={isCelebrating ? {
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ duration: 0.3 }}
          />
          
          {/* Face container */}
          <g transform="translate(25, 18)">
            {/* Left eye */}
            <motion.text
              x="0"
              y={eyes.leftY}
              fontSize="10"
              fill="hsl(var(--primary-foreground))"
              textAnchor="middle"
              fontWeight="bold"
              animate={{ opacity: expression === 'sleepy' ? [1, 0.5, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {eyes.left}
            </motion.text>
            
            {/* Right eye */}
            <motion.text
              x="18"
              y={eyes.leftY}
              fontSize="10"
              fill="hsl(var(--primary-foreground))"
              textAnchor="middle"
              fontWeight="bold"
              animate={{ opacity: expression === 'sleepy' ? [1, 0.5, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {eyes.right}
            </motion.text>
            
            {/* Mouth */}
            <motion.text
              x="9"
              y="12"
              fontSize="8"
              fill="hsl(var(--primary-foreground))"
              textAnchor="middle"
              animate={expression === 'excited' ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {expression === 'excited' || expression === 'amazed' ? '◡' : 
               expression === 'surprised' ? 'o' :
               expression === 'thinking' ? '~' : 'ᴗ'}
            </motion.text>
          </g>
          
          {/* Blush (for happy/excited) */}
          {(expression === 'happy' || expression === 'excited') && (
            <>
              <circle cx="20" cy="28" r="3" fill="hsl(var(--primary))" opacity="0.3" />
              <circle cx="48" cy="28" r="3" fill="hsl(var(--primary))" opacity="0.3" />
            </>
          )}
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
              <span className="text-xs bg-card/90 backdrop-blur px-2 py-1 rounded-full border border-border shadow-lg">
                Click me! ✨
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification dot */}
        {isMinimized && (
          <motion.div
            className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.div>
    </div>
  );
}
