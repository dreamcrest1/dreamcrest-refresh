import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

// Content database
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
  ],
  trivia: [
    "Did you know? India has 22 official languages! 🇮🇳",
    "Fun fact: Dreamcrest started in 2021!",
    "AI can write poems now! 🤖",
    "Netflix was founded in 1997!",
    "The first website went live in 1991!",
    "ChatGPT has 100M+ users!",
  ],
  gk: [
    "GK: India's national bird is the peacock! 🦚",
    "GK: The Taj Mahal took 22 years to build!",
    "GK: India invented the number zero!",
    "GK: Chess originated in India! ♟️",
    "GK: Bangalore is India's Silicon Valley!",
  ],
  techNews: [
    "🤖 AI: GPT-5 is revolutionizing conversations!",
    "🚀 Tech: SpaceX launched 50+ rockets this year!",
    "💻 AI: Gemini can now understand video!",
    "🎮 Gaming: AI NPCs are getting smarter!",
    "🔬 Science: Quantum computers hitting 1000 qubits!",
  ],
  funFacts: [
    "🍕 Fact: Pizza was invented in Naples, Italy!",
    "🐙 Fact: Octopuses have 3 hearts!",
    "🌙 Fact: A day on Venus is longer than its year!",
    "🦈 Fact: Sharks are older than trees!",
    "🍯 Fact: Honey never spoils - ever!",
  ],
  jokes: [
    "😂 Why do programmers hate nature? Too many bugs!",
    "🤣 What's a computer's favorite snack? Microchips!",
    "😄 Why was the JavaScript sad? It wasn't null!",
    "😆 How do trees access the internet? They log in!",
    "🤭 Why did the AI break up? No connection!",
  ],
  greetings: [
    "Hey there! Welcome! 👋",
    "Namaste! How can I help?",
    "Hi friend! Looking for deals?",
    "Hello! Great to see you! 😊",
    "Welcome to Dreamcrest! 🌟",
  ],
};

// Poses for stick figure
const poses = {
  idle: { body: { y: 0 }, head: { rotate: 0 }, leftArm: { rotate: -20 }, rightArm: { rotate: 20 }, leftLeg: { rotate: 8 }, rightLeg: { rotate: -8 }, expression: "smile" },
  wave: { body: { y: 0 }, head: { rotate: 5 }, leftArm: { rotate: -20 }, rightArm: { rotate: -150 }, leftLeg: { rotate: 0 }, rightLeg: { rotate: 0 }, expression: "happy" },
  dance1: { body: { y: -3 }, head: { rotate: -15 }, leftArm: { rotate: -70 }, rightArm: { rotate: 70 }, leftLeg: { rotate: 30 }, rightLeg: { rotate: -30 }, expression: "excited" },
  dance2: { body: { y: -3 }, head: { rotate: 15 }, leftArm: { rotate: 70 }, rightArm: { rotate: -70 }, leftLeg: { rotate: -30 }, rightLeg: { rotate: 30 }, expression: "excited" },
  excited: { body: { y: -5 }, head: { rotate: 0 }, leftArm: { rotate: -160 }, rightArm: { rotate: 160 }, leftLeg: { rotate: 15 }, rightLeg: { rotate: -15 }, expression: "wow" },
  thinking: { body: { y: 0 }, head: { rotate: 20 }, leftArm: { rotate: -30 }, rightArm: { rotate: -100 }, leftLeg: { rotate: 5 }, rightLeg: { rotate: 0 }, expression: "thinking" },
  jumping: { body: { y: -12 }, head: { rotate: 0 }, leftArm: { rotate: -130 }, rightArm: { rotate: 130 }, leftLeg: { rotate: -35 }, rightLeg: { rotate: 35 }, expression: "wow" },
};

type PoseKey = keyof typeof poses;

export function GlobalMascot() {
  const [isMinimized, setIsMinimized] = useState(false); // Start open
  const [currentPose, setCurrentPose] = useState<PoseKey>("wave");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<string>("greeting");
  const [isDancing, setIsDancing] = useState(false);

  const getRandomContent = useCallback(() => {
    const types = ["quotes", "trivia", "gk", "techNews", "funFacts", "jokes"] as const;
    const type = types[Math.floor(Math.random() * types.length)];
    const items = content[type];
    return { text: items[Math.floor(Math.random() * items.length)], type };
  }, []);

  // Show greeting on mount
  useEffect(() => {
    const greeting = content.greetings[Math.floor(Math.random() * content.greetings.length)];
    setMessage(greeting);
    setMessageType("greeting");
    setCurrentPose("wave");
    setTimeout(() => setCurrentPose("idle"), 2000);
  }, []);

  // Auto-change quotes every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const { text, type } = getRandomContent();
      setMessage(text);
      setMessageType(type);
      
      const actions: PoseKey[] = ["excited", "thinking", "jumping"];
      const action = actions[Math.floor(Math.random() * actions.length)];
      setCurrentPose(action);
      setTimeout(() => setCurrentPose("idle"), 1500);
      
      // Ensure bubble is visible
      setIsMinimized(false);
    }, 12000);

    return () => clearInterval(interval);
  }, [getRandomContent]);

  // Dancing animation
  useEffect(() => {
    if (!isDancing) return;
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setCurrentPose(frame % 2 === 0 ? "dance1" : "dance2");
    }, 350);
    const timeout = setTimeout(() => {
      setIsDancing(false);
      setCurrentPose("idle");
    }, 4000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [isDancing]);

  const handleClick = () => {
    if (isMinimized) {
      setIsMinimized(false);
      const { text, type } = getRandomContent();
      setMessage(text);
      setMessageType(type);
    } else {
      const { text, type } = getRandomContent();
      setMessage(text);
      setMessageType(type);
    }
    const reactions: PoseKey[] = ["excited", "jumping", "wave"];
    setCurrentPose(reactions[Math.floor(Math.random() * reactions.length)]);
    setTimeout(() => setCurrentPose("idle"), 1500);
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
      className="fixed bottom-28 right-6 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, type: "spring" }}
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {!isMinimized && message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full right-0 mb-3"
          >
            <div className="relative bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-xl min-w-[280px] max-w-[320px]">
              <div className="flex items-start gap-3">
                <Sparkles className={`h-5 w-5 mt-0.5 flex-shrink-0 ${typeInfo.color}`} />
                <div className="flex-1">
                  <span className={`text-xs uppercase font-bold tracking-wider ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>
                  <p className="text-sm mt-1.5 text-foreground leading-relaxed">{message}</p>
                </div>
              </div>
              <div className="absolute -bottom-2 right-10 w-4 h-4 bg-card/95 border-r border-b border-border rotate-45" />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
              className="absolute -top-2 -left-2 bg-muted rounded-full p-1.5 hover:bg-destructive/20 transition-colors shadow-md"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stick Figure */}
      <motion.div
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className="cursor-pointer select-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isDancing ? { y: [0, -8, 0] } : { y: pose.body.y }}
        transition={isDancing ? { duration: 0.35, repeat: Infinity } : { type: "spring" }}
      >
        <svg width="70" height="90" viewBox="0 0 70 90" className="drop-shadow-lg overflow-visible">
          <defs>
            <linearGradient id="mascotGradientGlobal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </linearGradient>
            <filter id="mascotShadowGlobal" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3"/>
            </filter>
          </defs>

          <g filter="url(#mascotShadowGlobal)">
            <ellipse cx={35} cy={88} rx={15} ry={4} fill="hsl(var(--foreground) / 0.15)" />
            
            <motion.line x1={35} y1={58} x2={22} y2={82} stroke="url(#mascotGradientGlobal)" strokeWidth={5} strokeLinecap="round"
              animate={{ rotate: pose.leftLeg.rotate }} style={{ originX: "35px", originY: "58px" }} transition={{ type: "spring", stiffness: 300 }} />
            <motion.line x1={35} y1={58} x2={48} y2={82} stroke="url(#mascotGradientGlobal)" strokeWidth={5} strokeLinecap="round"
              animate={{ rotate: pose.rightLeg.rotate }} style={{ originX: "35px", originY: "58px" }} transition={{ type: "spring", stiffness: 300 }} />
            <line x1={35} y1={32} x2={35} y2={58} stroke="url(#mascotGradientGlobal)" strokeWidth={5} strokeLinecap="round" />
            <motion.line x1={35} y1={38} x2={15} y2={52} stroke="url(#mascotGradientGlobal)" strokeWidth={5} strokeLinecap="round"
              animate={{ rotate: pose.leftArm.rotate }} style={{ originX: "35px", originY: "38px" }} transition={{ type: "spring", stiffness: 300 }} />
            <motion.line x1={35} y1={38} x2={55} y2={52} stroke="url(#mascotGradientGlobal)" strokeWidth={5} strokeLinecap="round"
              animate={{ rotate: pose.rightArm.rotate }} style={{ originX: "35px", originY: "38px" }} transition={{ type: "spring", stiffness: 300 }} />

            <motion.g animate={{ rotate: pose.head.rotate }} style={{ originX: "35px", originY: "18px" }} transition={{ type: "spring", stiffness: 300 }}>
              <ellipse cx={35} cy={4} rx={20} ry={4} fill="hsl(var(--secondary))" />
              <rect x={22} y={-10} width={26} height={14} rx={3} fill="hsl(var(--secondary))" />
              <rect x={27} y={-6} width={16} height={3} fill="hsl(var(--primary))" />
              <circle cx={35} cy={18} r={16} fill="hsl(var(--primary))" />
              
              {pose.expression === "smile" && (
                <>
                  <circle cx={29} cy={15} r={2.5} fill="hsl(var(--primary-foreground))" />
                  <circle cx={41} cy={15} r={2.5} fill="hsl(var(--primary-foreground))" />
                  <path d="M 27 22 Q 35 29 43 22" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2.5} strokeLinecap="round" />
                </>
              )}
              {pose.expression === "happy" && (
                <>
                  <path d="M 26 14 Q 29 12 32 14" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
                  <path d="M 38 14 Q 41 12 44 14" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
                  <path d="M 26 22 Q 35 30 44 22" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2.5} strokeLinecap="round" />
                </>
              )}
              {pose.expression === "excited" && (
                <>
                  <circle cx={29} cy={14} r={3} fill="hsl(var(--primary-foreground))" />
                  <circle cx={41} cy={14} r={3} fill="hsl(var(--primary-foreground))" />
                  <ellipse cx={35} cy={24} rx={6} ry={4} fill="hsl(var(--primary-foreground))" />
                </>
              )}
              {pose.expression === "wow" && (
                <>
                  <circle cx={29} cy={14} r={4} fill="hsl(var(--primary-foreground))" />
                  <circle cx={41} cy={14} r={4} fill="hsl(var(--primary-foreground))" />
                  <ellipse cx={35} cy={25} rx={4} ry={5} fill="hsl(var(--primary-foreground))" />
                </>
              )}
              {pose.expression === "thinking" && (
                <>
                  <circle cx={29} cy={15} r={2.5} fill="hsl(var(--primary-foreground))" />
                  <circle cx={41} cy={13} r={2.5} fill="hsl(var(--primary-foreground))" />
                  <path d="M 30 23 Q 35 21 40 23" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
                </>
              )}
            </motion.g>
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}

export default GlobalMascot;
