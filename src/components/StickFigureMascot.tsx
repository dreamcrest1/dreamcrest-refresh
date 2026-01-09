import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { X, Sparkles } from "lucide-react";

// Expanded content database
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
    "Success is a journey, not a destination!",
    "Think different, be different! 🧠",
    "The future belongs to the curious!",
    "Learn something new every day!",
    "Small steps lead to big changes!",
    "Believe in yourself! 💪",
    "Make today amazing!",
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
    "The first computer weighed 27 tons!",
    "Email was invented before the WWW!",
    "Google processes 8.5B searches daily!",
    "The first iPhone was released in 2007!",
    "Amazon started as a bookstore!",
    "WiFi was invented in 1997!",
    "The internet is 30+ years old!",
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
    "GK: India has 29 UNESCO World Heritage Sites!",
    "GK: Kumbh Mela is visible from space!",
    "GK: Yoga originated in India 5000 years ago!",
    "GK: India is the largest milk producer!",
    "GK: The Himalayas are still growing!",
    "GK: India has the world's largest postal network!",
    "GK: Indian Railways employs 1.3 million people!",
  ],
  techNews: [
    "🤖 AI: GPT-5 is revolutionizing conversations!",
    "🚀 Tech: SpaceX launched 50+ rockets this year!",
    "💻 AI: Gemini can now understand video!",
    "🎮 Gaming: AI NPCs are getting smarter!",
    "🔬 Science: Quantum computers hitting 1000 qubits!",
    "📱 Tech: Foldable phones are the future!",
    "🌐 Web: Web3 and blockchain evolving fast!",
    "🎨 AI: Midjourney creates stunning art!",
    "🚗 Tech: Self-driving cars getting safer!",
    "💡 AI: Claude & ChatGPT competing fiercely!",
    "🔊 Tech: Voice AI sounds more human!",
    "📊 Data: Big data is transforming business!",
    "🛡️ Security: AI fighting cyber threats!",
    "🏥 Health: AI diagnosing diseases faster!",
    "🎬 Media: AI generating Hollywood movies!",
  ],
  funFacts: [
    "🍕 Fact: Pizza was invented in Naples, Italy!",
    "🐙 Fact: Octopuses have 3 hearts!",
    "🌙 Fact: A day on Venus is longer than its year!",
    "🦈 Fact: Sharks are older than trees!",
    "🍯 Fact: Honey never spoils - ever!",
    "⚡ Fact: Lightning is 5x hotter than the sun!",
    "🐘 Fact: Elephants can't jump!",
    "🌊 Fact: 95% of oceans are unexplored!",
    "🦋 Fact: Butterflies taste with their feet!",
    "🌈 Fact: Rainbows are actually full circles!",
    "🧠 Fact: Your brain uses 20% of your energy!",
    "💎 Fact: Diamonds can be made from peanut butter!",
    "🦜 Fact: Parrots name their babies!",
    "🌍 Fact: Earth's core is as hot as the sun!",
    "🐋 Fact: Blue whale's heart is car-sized!",
  ],
  jokes: [
    "😂 Why do programmers hate nature? Too many bugs!",
    "🤣 What's a computer's favorite snack? Microchips!",
    "😄 Why was the JavaScript sad? It wasn't null!",
    "😆 How do trees access the internet? They log in!",
    "🤭 Why did the AI break up? No connection!",
    "😁 What's a robot's favorite music? Heavy metal!",
    "😂 Why don't scientists trust atoms? They make up everything!",
    "🤣 What do you call a sleeping dinosaur? A dino-snore!",
  ],
  greetings: [
    "Hey there! Welcome! 👋",
    "Namaste! How can I help?",
    "Hi friend! Looking for deals?",
    "Hello! Great to see you! 😊",
    "Welcome to Dreamcrest! 🌟",
    "Howdy! Ready to explore?",
    "Hey! Let's find you something cool!",
  ],
};

// Enhanced poses with more expressions
const poses = {
  idle: {
    head: { x: 0, y: 0, rotate: 0 },
    leftArm: { rotate: -15 },
    rightArm: { rotate: 15 },
    leftLeg: { rotate: 5 },
    rightLeg: { rotate: -5 },
    body: { scaleY: 1 },
    expression: "smile",
  },
  wave: {
    head: { x: 0, y: 0, rotate: 5 },
    leftArm: { rotate: -15 },
    rightArm: { rotate: -140 },
    leftLeg: { rotate: 0 },
    rightLeg: { rotate: 0 },
    body: { scaleY: 1 },
    expression: "happy",
  },
  dance1: {
    head: { x: 5, y: -3, rotate: -10 },
    leftArm: { rotate: -60 },
    rightArm: { rotate: 60 },
    leftLeg: { rotate: 25 },
    rightLeg: { rotate: -25 },
    body: { scaleY: 0.95 },
    expression: "excited",
  },
  dance2: {
    head: { x: -5, y: -3, rotate: 10 },
    leftArm: { rotate: 60 },
    rightArm: { rotate: -60 },
    leftLeg: { rotate: -25 },
    rightLeg: { rotate: 25 },
    body: { scaleY: 0.95 },
    expression: "excited",
  },
  excited: {
    head: { x: 0, y: -8, rotate: 0 },
    leftArm: { rotate: -160 },
    rightArm: { rotate: 160 },
    leftLeg: { rotate: 15 },
    rightLeg: { rotate: -15 },
    body: { scaleY: 1.05 },
    expression: "wow",
  },
  thinking: {
    head: { x: 5, y: 3, rotate: 15 },
    leftArm: { rotate: -30 },
    rightArm: { rotate: -90 },
    leftLeg: { rotate: 0 },
    rightLeg: { rotate: 5 },
    body: { scaleY: 1 },
    expression: "thinking",
  },
  jumping: {
    head: { x: 0, y: -15, rotate: 0 },
    leftArm: { rotate: -120 },
    rightArm: { rotate: 120 },
    leftLeg: { rotate: -30 },
    rightLeg: { rotate: 30 },
    body: { scaleY: 1.1 },
    expression: "wow",
  },
  dabbing: {
    head: { x: -10, y: 5, rotate: -30 },
    leftArm: { rotate: -45 },
    rightArm: { rotate: 150 },
    leftLeg: { rotate: 10 },
    rightLeg: { rotate: -10 },
    body: { scaleY: 1 },
    expression: "cool",
  },
  flexing: {
    head: { x: 0, y: -2, rotate: 0 },
    leftArm: { rotate: -100 },
    rightArm: { rotate: 100 },
    leftLeg: { rotate: 10 },
    rightLeg: { rotate: -10 },
    body: { scaleY: 1.05 },
    expression: "proud",
  },
  sleeping: {
    head: { x: 8, y: 10, rotate: 30 },
    leftArm: { rotate: 20 },
    rightArm: { rotate: 30 },
    leftLeg: { rotate: 0 },
    rightLeg: { rotate: 0 },
    body: { scaleY: 0.95 },
    expression: "sleeping",
  },
  running: {
    head: { x: 3, y: -5, rotate: -5 },
    leftArm: { rotate: 45 },
    rightArm: { rotate: -45 },
    leftLeg: { rotate: -40 },
    rightLeg: { rotate: 40 },
    body: { scaleY: 1 },
    expression: "determined",
  },
};

type PoseKey = keyof typeof poses;

// Expression renderer
function Expression({ type, scale = 1 }: { type: string; scale?: number }) {
  const s = 14 * scale;
  
  switch (type) {
    case "smile":
      return (
        <>
          <circle cx={24} cy={12} r={2.5} fill="hsl(var(--primary-foreground))" />
          <circle cx={36} cy={12} r={2.5} fill="hsl(var(--primary-foreground))" />
          <path d="M 22 18 Q 30 26 38 18" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2.5} strokeLinecap="round" />
        </>
      );
    case "happy":
      return (
        <>
          <path d="M 21 10 Q 24 8 27 12" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
          <path d="M 33 12 Q 36 8 39 10" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
          <path d="M 20 18 Q 30 28 40 18" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2.5} strokeLinecap="round" />
        </>
      );
    case "excited":
      return (
        <>
          <circle cx={24} cy={11} r={3} fill="hsl(var(--primary-foreground))" />
          <circle cx={36} cy={11} r={3} fill="hsl(var(--primary-foreground))" />
          <ellipse cx={30} cy={22} rx={6} ry={4} fill="hsl(var(--primary-foreground))" />
        </>
      );
    case "wow":
      return (
        <>
          <circle cx={24} cy={10} r={3.5} fill="hsl(var(--primary-foreground))" />
          <circle cx={36} cy={10} r={3.5} fill="hsl(var(--primary-foreground))" />
          <ellipse cx={30} cy={22} rx={5} ry={6} fill="hsl(var(--primary-foreground))" />
        </>
      );
    case "thinking":
      return (
        <>
          <circle cx={24} cy={12} r={2} fill="hsl(var(--primary-foreground))" />
          <circle cx={36} cy={10} r={2.5} fill="hsl(var(--primary-foreground))" />
          <path d="M 25 20 Q 30 18 35 20" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
        </>
      );
    case "cool":
      return (
        <>
          <rect x={19} y={8} width={10} height={6} rx={2} fill="hsl(var(--primary-foreground))" />
          <rect x={31} y={8} width={10} height={6} rx={2} fill="hsl(var(--primary-foreground))" />
          <path d="M 24 20 Q 30 24 36 20" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
        </>
      );
    case "proud":
      return (
        <>
          <path d="M 21 11 L 27 11" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
          <path d="M 33 11 L 39 11" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
          <path d="M 23 19 Q 30 25 37 19" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2.5} strokeLinecap="round" />
        </>
      );
    case "sleeping":
      return (
        <>
          <path d="M 21 12 L 27 12" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
          <path d="M 33 12 L 39 12" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
          <path d="M 26 20 Q 30 22 34 20" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
          <text x={42} y={8} fontSize={8} fill="hsl(var(--primary-foreground))">z</text>
          <text x={46} y={4} fontSize={6} fill="hsl(var(--primary-foreground))">z</text>
        </>
      );
    case "determined":
      return (
        <>
          <path d="M 21 9 L 27 12" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
          <path d="M 33 12 L 39 9" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
          <circle cx={24} cy={14} r={2} fill="hsl(var(--primary-foreground))" />
          <circle cx={36} cy={14} r={2} fill="hsl(var(--primary-foreground))" />
          <path d="M 26 21 L 34 21" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
        </>
      );
    default:
      return (
        <>
          <circle cx={24} cy={12} r={2.5} fill="hsl(var(--primary-foreground))" />
          <circle cx={36} cy={12} r={2.5} fill="hsl(var(--primary-foreground))" />
          <path d="M 24 20 Q 30 24 36 20" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
        </>
      );
  }
}

export function StickFigureMascot() {
  const [isMinimized, setIsMinimized] = useState(true);
  const [currentPose, setCurrentPose] = useState<PoseKey>("idle");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<string>("quote");
  const [isDancing, setIsDancing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse following
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Track mouse position for following
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate position relative to bottom-left, with bounds
      const targetX = Math.min(Math.max(e.clientX - 60, 20), window.innerWidth - 120);
      const targetY = Math.min(Math.max(e.clientY - 60, 100), window.innerHeight - 150);
      
      // Only follow if mouse is somewhat close (within 400px)
      const currentX = springX.get() || 24;
      const currentY = springY.get() || window.innerHeight - 150;
      const distance = Math.sqrt(Math.pow(e.clientX - currentX - 40, 2) + Math.pow(e.clientY - currentY - 50, 2));
      
      if (distance < 400) {
        mouseX.set(targetX);
        mouseY.set(targetY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, springX, springY]);

  // Initialize position
  useEffect(() => {
    mouseX.set(24);
    mouseY.set(window.innerHeight - 150);
  }, [mouseX, mouseY]);

  // Random content generator
  const getRandomContent = useCallback(() => {
    const types = ["quotes", "trivia", "gk", "techNews", "funFacts", "jokes"] as const;
    const type = types[Math.floor(Math.random() * types.length)];
    const items = content[type];
    return {
      text: items[Math.floor(Math.random() * items.length)],
      type,
    };
  }, []);

  // Greeting on first open
  const showGreeting = useCallback(() => {
    const greeting = content.greetings[Math.floor(Math.random() * content.greetings.length)];
    setMessage(greeting);
    setMessageType("greeting");
    setCurrentPose("wave");
    setTimeout(() => setCurrentPose("idle"), 2000);
  }, []);

  // Dancing animation loop
  useEffect(() => {
    if (!isDancing) return;
    
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setCurrentPose(frame % 2 === 0 ? "dance1" : "dance2");
    }, 400);

    // Stop dancing after 4 seconds
    const timeout = setTimeout(() => {
      setIsDancing(false);
      setCurrentPose("idle");
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isDancing]);

  // Show random message periodically
  useEffect(() => {
    if (!isMinimized) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setIsMinimized(false);
        const { text, type } = getRandomContent();
        setMessage(text);
        setMessageType(type);
        
        // Random action
        const actions = ["excited", "thinking", "jumping", "flexing", "dance"] as const;
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        if (action === "dance") {
          setIsDancing(true);
        } else {
          setCurrentPose(action);
          setTimeout(() => setCurrentPose("idle"), 2000);
        }
        
        setTimeout(() => {
          setIsMinimized(true);
        }, 8000);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [isMinimized, getRandomContent]);

  const handleClick = () => {
    if (isMinimized) {
      setIsMinimized(false);
      showGreeting();
    } else {
      const { text, type } = getRandomContent();
      setMessage(text);
      setMessageType(type);
      
      // Random reaction
      const reactions: PoseKey[] = ["excited", "jumping", "dabbing", "flexing", "wave"];
      const reaction = reactions[Math.floor(Math.random() * reactions.length)];
      setCurrentPose(reaction);
      setTimeout(() => setCurrentPose("idle"), 1500);
    }
  };

  const handleDoubleClick = () => {
    setIsDancing(true);
    setIsMinimized(false);
    setMessage("Let's dance! 💃🕺");
    setMessageType("fun");
  };

  const pose = poses[currentPose];

  const getTypeLabel = () => {
    switch (messageType) {
      case "quotes": return { label: "💭 Quote", color: "text-primary" };
      case "trivia": return { label: "🎯 Trivia", color: "text-blue-500" };
      case "gk": return { label: "📚 GK", color: "text-green-500" };
      case "techNews": return { label: "🤖 Tech News", color: "text-purple-500" };
      case "funFacts": return { label: "✨ Fun Fact", color: "text-yellow-500" };
      case "jokes": return { label: "😂 Joke", color: "text-pink-500" };
      case "greeting": return { label: "👋 Hello!", color: "text-primary" };
      case "fun": return { label: "🎉 Party!", color: "text-secondary" };
      default: return { label: "💬 Message", color: "text-muted-foreground" };
    }
  };

  const typeInfo = getTypeLabel();

  return (
    <motion.div
      ref={containerRef}
      className="fixed z-50"
      style={{ 
        left: springX, 
        top: springY,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, type: "spring" }}
    >
      {/* Speech bubble - Landscape */}
      <AnimatePresence>
        {!isMinimized && message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -20 }}
            className="absolute bottom-full left-16 mb-2"
          >
            <div className="relative bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-3 shadow-xl min-w-[280px] max-w-[320px]">
              <div className="flex items-start gap-3">
                <Sparkles className={`h-4 w-4 mt-0.5 flex-shrink-0 ${typeInfo.color}`} />
                <div className="flex-1">
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>
                  <p className="text-sm mt-1 text-foreground leading-relaxed">{message}</p>
                </div>
              </div>
              {/* Speech bubble tail */}
              <div className="absolute -bottom-2 left-8 w-4 h-4 bg-card/95 border-r border-b border-border rotate-45" />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
              className="absolute -top-2 -right-2 bg-muted rounded-full p-1.5 hover:bg-destructive/20 transition-colors shadow-md"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stick Figure - Bigger */}
      <motion.div
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className="cursor-pointer select-none"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isDancing ? { y: [0, -5, 0] } : {}}
        transition={isDancing ? { duration: 0.4, repeat: Infinity } : {}}
      >
        <svg
          width="80"
          height="100"
          viewBox="0 0 60 80"
          className="drop-shadow-lg"
        >
          {/* Glow effect */}
          <defs>
            <filter id="mascotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </linearGradient>
          </defs>

          {/* Body group */}
          <g filter="url(#mascotGlow)">
            {/* Shadow */}
            <ellipse cx={30} cy={78} rx={12} ry={3} fill="hsl(var(--foreground) / 0.1)" />
            
            {/* Left Leg */}
            <motion.line
              x1={30}
              y1={50}
              x2={18}
              y2={72}
              stroke="url(#bodyGradient)"
              strokeWidth={4}
              strokeLinecap="round"
              style={{ originX: "30px", originY: "50px" }}
              animate={{ rotate: pose.leftLeg.rotate }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            {/* Right Leg */}
            <motion.line
              x1={30}
              y1={50}
              x2={42}
              y2={72}
              stroke="url(#bodyGradient)"
              strokeWidth={4}
              strokeLinecap="round"
              style={{ originX: "30px", originY: "50px" }}
              animate={{ rotate: pose.rightLeg.rotate }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            {/* Body */}
            <motion.line
              x1={30}
              y1={28}
              x2={30}
              y2={50}
              stroke="url(#bodyGradient)"
              strokeWidth={4}
              strokeLinecap="round"
              animate={{ scaleY: pose.body.scaleY }}
              style={{ originY: "50px" }}
            />

            {/* Left Arm */}
            <motion.line
              x1={30}
              y1={34}
              x2={12}
              y2={48}
              stroke="url(#bodyGradient)"
              strokeWidth={4}
              strokeLinecap="round"
              style={{ originX: "30px", originY: "34px" }}
              animate={{ rotate: pose.leftArm.rotate }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            {/* Right Arm */}
            <motion.line
              x1={30}
              y1={34}
              x2={48}
              y2={48}
              stroke="url(#bodyGradient)"
              strokeWidth={4}
              strokeLinecap="round"
              style={{ originX: "30px", originY: "34px" }}
              animate={{ rotate: pose.rightArm.rotate }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            {/* Head */}
            <motion.g
              animate={{
                x: pose.head.x,
                y: pose.head.y,
                rotate: pose.head.rotate,
              }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ originX: "30px", originY: "15px" }}
            >
              <circle
                cx={30}
                cy={14}
                r={14}
                fill="hsl(var(--primary))"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
              {/* Face */}
              <Expression type={pose.expression} />
            </motion.g>
          </g>
        </svg>

        {/* Notification indicator */}
        {isMinimized && (
          <motion.div
            className="absolute -top-1 right-0 bg-destructive rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-[10px] text-destructive-foreground font-bold">!</span>
          </motion.div>
        )}
      </motion.div>

      {/* Click hints */}
      {isMinimized && (
        <motion.div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground whitespace-nowrap text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 3 }}
        >
          Click me! Double-click to dance!
        </motion.div>
      )}
    </motion.div>
  );
}

export default StickFigureMascot;
