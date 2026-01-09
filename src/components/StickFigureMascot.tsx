import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    "GK: India has over 1.4 billion people!",
    "GK: The Ganges is 2,525 km long!",
    "GK: India has 6 seasons, not 4!",
    "GK: Varanasi is one of the oldest cities!",
    "GK: India's IT industry is worth $200B+!",
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
    "🤖 AI: Sora creates amazing videos!",
    "💰 Crypto: Bitcoin hitting new highs!",
    "🧬 Biotech: CRISPR changing medicine!",
    "🔋 Energy: EV batteries improving fast!",
    "🛰️ Space: Starlink covers the globe!",
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
    "🦷 Fact: Tooth enamel is the hardest body part!",
    "🌲 Fact: Trees can communicate underground!",
    "🦑 Fact: Giant squids have basketball-sized eyes!",
    "🌶️ Fact: Capsaicin makes peppers spicy!",
    "🦴 Fact: Babies have 300 bones, adults have 206!",
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
    "😄 Why did the developer go broke? Used too much cache!",
    "😆 What's a hacker's favorite season? Phishing season!",
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
    body: { y: 0 },
    head: { rotate: 0 },
    leftArm: { rotate: -20 },
    rightArm: { rotate: 20 },
    leftLeg: { rotate: 8 },
    rightLeg: { rotate: -8 },
    expression: "smile",
  },
  wave: {
    body: { y: 0 },
    head: { rotate: 5 },
    leftArm: { rotate: -20 },
    rightArm: { rotate: -150 },
    leftLeg: { rotate: 0 },
    rightLeg: { rotate: 0 },
    expression: "happy",
  },
  dance1: {
    body: { y: -3 },
    head: { rotate: -15 },
    leftArm: { rotate: -70 },
    rightArm: { rotate: 70 },
    leftLeg: { rotate: 30 },
    rightLeg: { rotate: -30 },
    expression: "excited",
  },
  dance2: {
    body: { y: -3 },
    head: { rotate: 15 },
    leftArm: { rotate: 70 },
    rightArm: { rotate: -70 },
    leftLeg: { rotate: -30 },
    rightLeg: { rotate: 30 },
    expression: "excited",
  },
  excited: {
    body: { y: -5 },
    head: { rotate: 0 },
    leftArm: { rotate: -160 },
    rightArm: { rotate: 160 },
    leftLeg: { rotate: 15 },
    rightLeg: { rotate: -15 },
    expression: "wow",
  },
  thinking: {
    body: { y: 0 },
    head: { rotate: 20 },
    leftArm: { rotate: -30 },
    rightArm: { rotate: -100 },
    leftLeg: { rotate: 5 },
    rightLeg: { rotate: 0 },
    expression: "thinking",
  },
  jumping: {
    body: { y: -12 },
    head: { rotate: 0 },
    leftArm: { rotate: -130 },
    rightArm: { rotate: 130 },
    leftLeg: { rotate: -35 },
    rightLeg: { rotate: 35 },
    expression: "wow",
  },
  dabbing: {
    body: { y: 0 },
    head: { rotate: -35 },
    leftArm: { rotate: -50 },
    rightArm: { rotate: 160 },
    leftLeg: { rotate: 15 },
    rightLeg: { rotate: -10 },
    expression: "cool",
  },
  flexing: {
    body: { y: -2 },
    head: { rotate: 0 },
    leftArm: { rotate: -110 },
    rightArm: { rotate: 110 },
    leftLeg: { rotate: 12 },
    rightLeg: { rotate: -12 },
    expression: "proud",
  },
};

type PoseKey = keyof typeof poses;

export function StickFigureMascot() {
  const [isMinimized, setIsMinimized] = useState(true);
  const [currentPose, setCurrentPose] = useState<PoseKey>("idle");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<string>("quote");
  const [isDancing, setIsDancing] = useState(false);

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
    }, 350);

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
      if (Math.random() > 0.5) {
        setIsMinimized(false);
        const { text, type } = getRandomContent();
        setMessage(text);
        setMessageType(type);
        
        const actions = ["excited", "thinking", "jumping", "flexing"] as const;
        const action = actions[Math.floor(Math.random() * actions.length)];
        setCurrentPose(action);
        setTimeout(() => setCurrentPose("idle"), 2000);
        
        setTimeout(() => {
          setIsMinimized(true);
        }, 7000);
      }
    }, 10000);

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
      className="fixed bottom-28 right-6 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, type: "spring" }}
    >
      {/* Speech bubble - Landscape */}
      <AnimatePresence>
        {!isMinimized && message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full right-0 mb-3"
          >
            <div className="relative bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-xl min-w-[300px] max-w-[340px]">
              <div className="flex items-start gap-3">
                <Sparkles className={`h-5 w-5 mt-0.5 flex-shrink-0 ${typeInfo.color}`} />
                <div className="flex-1">
                  <span className={`text-xs uppercase font-bold tracking-wider ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>
                  <p className="text-sm mt-1.5 text-foreground leading-relaxed">{message}</p>
                </div>
              </div>
              {/* Speech bubble tail */}
              <div className="absolute -bottom-2 right-10 w-4 h-4 bg-card/95 border-r border-b border-border rotate-45" />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
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
        <svg
          width="70"
          height="90"
          viewBox="0 0 70 90"
          className="drop-shadow-lg overflow-visible"
        >
          <defs>
            <linearGradient id="mascotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </linearGradient>
            <filter id="mascotShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3"/>
            </filter>
          </defs>

          <g filter="url(#mascotShadow)">
            {/* Shadow on ground */}
            <ellipse cx={35} cy={88} rx={15} ry={4} fill="hsl(var(--foreground) / 0.15)" />
            
            {/* Left Leg */}
            <motion.line
              x1={35}
              y1={58}
              x2={22}
              y2={82}
              stroke="url(#mascotGradient)"
              strokeWidth={5}
              strokeLinecap="round"
              animate={{ rotate: pose.leftLeg.rotate }}
              style={{ originX: "35px", originY: "58px" }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            {/* Right Leg */}
            <motion.line
              x1={35}
              y1={58}
              x2={48}
              y2={82}
              stroke="url(#mascotGradient)"
              strokeWidth={5}
              strokeLinecap="round"
              animate={{ rotate: pose.rightLeg.rotate }}
              style={{ originX: "35px", originY: "58px" }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            {/* Body */}
            <line
              x1={35}
              y1={32}
              x2={35}
              y2={58}
              stroke="url(#mascotGradient)"
              strokeWidth={5}
              strokeLinecap="round"
            />

            {/* Left Arm */}
            <motion.line
              x1={35}
              y1={38}
              x2={15}
              y2={52}
              stroke="url(#mascotGradient)"
              strokeWidth={5}
              strokeLinecap="round"
              animate={{ rotate: pose.leftArm.rotate }}
              style={{ originX: "35px", originY: "38px" }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            {/* Right Arm */}
            <motion.line
              x1={35}
              y1={38}
              x2={55}
              y2={52}
              stroke="url(#mascotGradient)"
              strokeWidth={5}
              strokeLinecap="round"
              animate={{ rotate: pose.rightArm.rotate }}
              style={{ originX: "35px", originY: "38px" }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            {/* Head */}
            <motion.g
              animate={{ rotate: pose.head.rotate }}
              style={{ originX: "35px", originY: "18px" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Hat */}
              <ellipse cx={35} cy={4} rx={20} ry={4} fill="hsl(var(--secondary))" />
              <rect x={22} y={-10} width={26} height={14} rx={3} fill="hsl(var(--secondary))" />
              <rect x={27} y={-6} width={16} height={3} fill="hsl(var(--primary))" />
              
              <circle
                cx={35}
                cy={18}
                r={16}
                fill="hsl(var(--primary))"
              />
              
              {/* Face based on expression */}
              {pose.expression === "smile" && (
                <>
                  <circle cx={29} cy={15} r={2.5} fill="hsl(var(--primary-foreground))" />
                  <circle cx={41} cy={15} r={2.5} fill="hsl(var(--primary-foreground))" />
                  <path d="M 27 22 Q 35 29 43 22" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2.5} strokeLinecap="round" />
                </>
              )}
              {pose.expression === "happy" && (
                <>
                  <path d="M 26 13 Q 29 11 32 15" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
                  <path d="M 38 15 Q 41 11 44 13" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
                  <path d="M 25 22 Q 35 31 45 22" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2.5} strokeLinecap="round" />
                </>
              )}
              {pose.expression === "excited" && (
                <>
                  <circle cx={29} cy={14} r={3} fill="hsl(var(--primary-foreground))" />
                  <circle cx={41} cy={14} r={3} fill="hsl(var(--primary-foreground))" />
                  <ellipse cx={35} cy={24} rx={5} ry={4} fill="hsl(var(--primary-foreground))" />
                </>
              )}
              {pose.expression === "wow" && (
                <>
                  <circle cx={29} cy={13} r={3.5} fill="hsl(var(--primary-foreground))" />
                  <circle cx={41} cy={13} r={3.5} fill="hsl(var(--primary-foreground))" />
                  <ellipse cx={35} cy={24} rx={4} ry={5} fill="hsl(var(--primary-foreground))" />
                </>
              )}
              {pose.expression === "thinking" && (
                <>
                  <circle cx={29} cy={15} r={2} fill="hsl(var(--primary-foreground))" />
                  <circle cx={41} cy={13} r={2.5} fill="hsl(var(--primary-foreground))" />
                  <path d="M 30 23 Q 35 21 40 23" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
                </>
              )}
              {pose.expression === "cool" && (
                <>
                  <rect x={24} y={11} width={10} height={5} rx={2} fill="hsl(var(--primary-foreground))" />
                  <rect x={36} y={11} width={10} height={5} rx={2} fill="hsl(var(--primary-foreground))" />
                  <path d="M 29 23 Q 35 27 41 23" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
                </>
              )}
              {pose.expression === "proud" && (
                <>
                  <path d="M 26 14 L 32 14" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
                  <path d="M 38 14 L 44 14" stroke="hsl(var(--primary-foreground))" strokeWidth={2} strokeLinecap="round" />
                  <path d="M 28 22 Q 35 28 42 22" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth={2.5} strokeLinecap="round" />
                </>
              )}
            </motion.g>
          </g>
        </svg>

        {/* Notification indicator */}
        {isMinimized && (
          <motion.div
            className="absolute -top-1 -left-1 bg-destructive rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-[10px] text-destructive-foreground font-bold">!</span>
          </motion.div>
        )}
      </motion.div>

      {/* Click hint */}
      {isMinimized && (
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground whitespace-nowrap text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 3 }}
        >
          Click me!
        </motion.div>
      )}
    </motion.div>
  );
}

export default StickFigureMascot;
