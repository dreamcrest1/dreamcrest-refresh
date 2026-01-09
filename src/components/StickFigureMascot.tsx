import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";

// Fun quotes, trivia, and GK facts
const content = {
  quotes: [
    "Dream big, start small! 🚀",
    "Every expert was once a beginner!",
    "Stay curious, stay creative! ✨",
    "Code is poetry in motion!",
    "Innovation starts with imagination!",
    "Quality over quantity, always!",
    "80% OFF? That's insane! 🔥",
    "Your dreams are valid! 💫",
  ],
  trivia: [
    "Did you know? India has 22 official languages! 🇮🇳",
    "Fun fact: Dreamcrest started in 2021!",
    "AI can write poems now! 🤖",
    "Netflix was founded in 1997!",
    "The first website went live in 1991!",
    "ChatGPT has 100M+ users!",
    "India is the 5th largest economy!",
    "YouTube has 2.5B monthly users!",
  ],
  gk: [
    "GK: India's national bird is the peacock! 🦚",
    "GK: The Taj Mahal took 22 years to build!",
    "GK: India invented the number zero!",
    "GK: Chess originated in India! ♟️",
    "GK: Bangalore is India's Silicon Valley!",
    "GK: India has the 2nd largest internet users!",
    "GK: Bollywood makes 1500+ films yearly!",
    "GK: India's space program is super efficient!",
  ],
  greetings: [
    "Hey there! Welcome! 👋",
    "Namaste! How can I help?",
    "Hi friend! Looking for deals?",
    "Hello! Great to see you! 😊",
  ],
};

// Stick figure poses/animations
const poses = {
  idle: {
    head: { x: 0, y: 0 },
    leftArm: { rotate: -10 },
    rightArm: { rotate: 10 },
    leftLeg: { rotate: 5 },
    rightLeg: { rotate: -5 },
  },
  wave: {
    head: { x: 0, y: 0 },
    leftArm: { rotate: -10 },
    rightArm: { rotate: -120 },
    leftLeg: { rotate: 0 },
    rightLeg: { rotate: 0 },
  },
  dance: {
    head: { x: 5, y: -3 },
    leftArm: { rotate: -45 },
    rightArm: { rotate: 45 },
    leftLeg: { rotate: 20 },
    rightLeg: { rotate: -20 },
  },
  excited: {
    head: { x: 0, y: -5 },
    leftArm: { rotate: -150 },
    rightArm: { rotate: 150 },
    leftLeg: { rotate: 10 },
    rightLeg: { rotate: -10 },
  },
  thinking: {
    head: { x: 3, y: 2 },
    leftArm: { rotate: -30 },
    rightArm: { rotate: -80 },
    leftLeg: { rotate: 0 },
    rightLeg: { rotate: 0 },
  },
};

export function StickFigureMascot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [currentPose, setCurrentPose] = useState<keyof typeof poses>("idle");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"quote" | "trivia" | "gk">("quote");

  // Random content generator
  const getRandomContent = useCallback(() => {
    const types: ("quotes" | "trivia" | "gk")[] = ["quotes", "trivia", "gk"];
    const type = types[Math.floor(Math.random() * types.length)];
    const items = content[type];
    return {
      text: items[Math.floor(Math.random() * items.length)],
      type: type === "quotes" ? "quote" : type === "trivia" ? "trivia" : "gk",
    };
  }, []);

  // Greeting on first open
  const showGreeting = useCallback(() => {
    const greeting = content.greetings[Math.floor(Math.random() * content.greetings.length)];
    setMessage(greeting);
    setCurrentPose("wave");
    setTimeout(() => setCurrentPose("idle"), 2000);
  }, []);

  // Show random message periodically
  useEffect(() => {
    if (!isMinimized) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsMinimized(false);
        const { text, type } = getRandomContent();
        setMessage(text);
        setMessageType(type as "quote" | "trivia" | "gk");
        
        // Random pose for the message
        const poseKeys = ["dance", "excited", "thinking"] as const;
        setCurrentPose(poseKeys[Math.floor(Math.random() * poseKeys.length)]);
        
        setTimeout(() => {
          setIsMinimized(true);
          setCurrentPose("idle");
        }, 6000);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isMinimized, getRandomContent]);

  // Dance animation loop
  useEffect(() => {
    if (currentPose !== "dance") return;
    
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      // This triggers re-render for dance movement
    }, 300);

    return () => clearInterval(interval);
  }, [currentPose]);

  const handleClick = () => {
    if (isMinimized) {
      setIsMinimized(false);
      showGreeting();
    } else {
      const { text, type } = getRandomContent();
      setMessage(text);
      setMessageType(type as "quote" | "trivia" | "gk");
      
      // Animate on new message
      setCurrentPose("excited");
      setTimeout(() => setCurrentPose("idle"), 1500);
    }
  };

  const pose = poses[currentPose];

  return (
    <motion.div
      className="fixed bottom-24 left-6 z-50"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 2, type: "spring" }}
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {!isMinimized && message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full left-0 mb-2 max-w-[200px]"
          >
            <div className="relative bg-card border border-border rounded-xl p-3 shadow-lg">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${
                messageType === "quote" ? "text-primary" : 
                messageType === "trivia" ? "text-secondary" : 
                "text-green-500"
              }`}>
                {messageType === "quote" ? "💭 Quote" : messageType === "trivia" ? "🎯 Trivia" : "📚 GK"}
              </span>
              <p className="text-sm mt-1 text-foreground">{message}</p>
              {/* Speech bubble tail */}
              <div className="absolute -bottom-2 left-6 w-4 h-4 bg-card border-r border-b border-border rotate-45" />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
              className="absolute -top-2 -right-2 bg-muted rounded-full p-1 hover:bg-muted-foreground/20 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stick Figure */}
      <motion.div
        onClick={handleClick}
        className="cursor-pointer select-none"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          width="60"
          height="80"
          viewBox="0 0 60 80"
          className="drop-shadow-lg"
        >
          {/* Glow effect */}
          <defs>
            <filter id="mascotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Body group */}
          <g filter="url(#mascotGlow)">
            {/* Head */}
            <motion.circle
              cx={30}
              cy={15}
              r={12}
              fill="hsl(var(--primary))"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth={2}
              animate={{
                cx: 30 + pose.head.x,
                cy: 15 + pose.head.y,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            
            {/* Face - eyes */}
            <motion.g
              animate={{
                x: pose.head.x,
                y: pose.head.y,
              }}
            >
              <circle cx={26} cy={13} r={2} fill="hsl(var(--primary-foreground))" />
              <circle cx={34} cy={13} r={2} fill="hsl(var(--primary-foreground))" />
              {/* Smile */}
              <motion.path
                d="M 25 18 Q 30 23 35 18"
                fill="none"
                stroke="hsl(var(--primary-foreground))"
                strokeWidth={2}
                strokeLinecap="round"
                animate={{
                  d: currentPose === "excited" 
                    ? "M 24 17 Q 30 25 36 17" 
                    : currentPose === "thinking"
                    ? "M 27 19 L 33 19"
                    : "M 25 18 Q 30 23 35 18"
                }}
              />
            </motion.g>

            {/* Body */}
            <line
              x1={30}
              y1={27}
              x2={30}
              y2={50}
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              strokeLinecap="round"
            />

            {/* Left Arm */}
            <motion.line
              x1={30}
              y1={32}
              x2={15}
              y2={45}
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              strokeLinecap="round"
              style={{ originX: "30px", originY: "32px" }}
              animate={{ rotate: pose.leftArm.rotate }}
              transition={{ type: "spring", stiffness: 200 }}
            />

            {/* Right Arm */}
            <motion.line
              x1={30}
              y1={32}
              x2={45}
              y2={45}
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              strokeLinecap="round"
              style={{ originX: "30px", originY: "32px" }}
              animate={{ rotate: pose.rightArm.rotate }}
              transition={{ type: "spring", stiffness: 200 }}
            />

            {/* Left Leg */}
            <motion.line
              x1={30}
              y1={50}
              x2={20}
              y2={70}
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              strokeLinecap="round"
              style={{ originX: "30px", originY: "50px" }}
              animate={{ rotate: pose.leftLeg.rotate }}
              transition={{ type: "spring", stiffness: 200 }}
            />

            {/* Right Leg */}
            <motion.line
              x1={30}
              y1={50}
              x2={40}
              y2={70}
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              strokeLinecap="round"
              style={{ originX: "30px", originY: "50px" }}
              animate={{ rotate: pose.rightLeg.rotate }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          </g>
        </svg>

        {/* Minimized indicator */}
        {isMinimized && (
          <motion.div
            className="absolute -top-1 -right-1 bg-primary rounded-full p-1"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <MessageCircle className="h-3 w-3 text-primary-foreground" />
          </motion.div>
        )}
      </motion.div>

      {/* Click hint */}
      {isMinimized && (
        <motion.div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 5 }}
        >
          Click me! 👆
        </motion.div>
      )}
    </motion.div>
  );
}

export default StickFigureMascot;
