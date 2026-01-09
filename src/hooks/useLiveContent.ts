import { useState, useCallback, useRef, useEffect } from 'react';

// Static fallback content
const staticContent = {
  quotes: [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
    "Stay hungry, stay foolish. - Steve Jobs",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  ],
  trivia: [
    "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible!",
    "Octopuses have three hearts and blue blood!",
    "A group of flamingos is called a 'flamboyance'!",
    "The shortest war in history lasted only 38 minutes (Britain vs Zanzibar, 1896)!",
    "Bananas are berries, but strawberries aren't!",
  ],
  facts: [
    "The human brain uses about 20% of the body's total energy!",
    "Light from the Sun takes about 8 minutes to reach Earth!",
    "There are more stars in the universe than grains of sand on Earth!",
    "The Great Wall of China is not visible from space with the naked eye!",
    "Water can boil and freeze at the same time (triple point)!",
  ],
  jokes: [
    "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
    "I told my computer I needed a break, and now it won't stop sending me Kit Kat ads! 🍫",
    "Why did the developer go broke? Because he used up all his cache! 💸",
    "There are only 10 types of people: those who understand binary and those who don't! 🔢",
    "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?' 🍺",
  ],
  techNews: [
    "AI is revolutionizing how we work and create content every day!",
    "Cloud computing continues to transform businesses worldwide!",
    "Cybersecurity is more important than ever in our connected world!",
    "5G networks are enabling new possibilities in IoT and smart cities!",
    "Quantum computing is making breakthroughs in complex problem-solving!",
  ],
  greetings: [
    "Hey there! I'm Dreamy, your friendly cloud companion! ☁️✨",
    "Welcome to Dreamcrest! Ready to explore amazing deals? 🎉",
    "Hi friend! Click me for fun facts and awesome content! 💫",
    "Namaste! I'm here to make your shopping experience magical! 🙏",
  ],
};

export type ContentType = 'quote' | 'trivia' | 'fact' | 'joke' | 'tech' | 'greeting';

export interface ContentItem {
  text: string;
  type: ContentType;
  isLive: boolean;
  source?: string;
}

interface CacheItem {
  content: ContentItem;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_DELAY = 30 * 1000; // 30 seconds between API calls

export function useLiveContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Map<string, CacheItem>>(new Map());
  const lastFetchRef = useRef<number>(0);

  // Get random static content
  const getStaticContent = useCallback((type?: ContentType): ContentItem => {
    const types: ContentType[] = ['quote', 'trivia', 'fact', 'joke', 'tech', 'greeting'];
    const selectedType = type || types[Math.floor(Math.random() * types.length)];
    
    let pool: string[];
    switch (selectedType) {
      case 'quote':
        pool = staticContent.quotes;
        break;
      case 'trivia':
        pool = staticContent.trivia;
        break;
      case 'fact':
        pool = staticContent.facts;
        break;
      case 'joke':
        pool = staticContent.jokes;
        break;
      case 'tech':
        pool = staticContent.techNews;
        break;
      case 'greeting':
        pool = staticContent.greetings;
        break;
      default:
        pool = staticContent.facts;
    }
    
    return {
      text: pool[Math.floor(Math.random() * pool.length)],
      type: selectedType,
      isLive: false,
    };
  }, []);

  // Fetch from free APIs
  const fetchLiveContent = useCallback(async (): Promise<ContentItem> => {
    const now = Date.now();
    
    // Rate limiting
    if (now - lastFetchRef.current < RATE_LIMIT_DELAY) {
      return getStaticContent();
    }

    // 30% chance to use static content for variety
    if (Math.random() < 0.3) {
      return getStaticContent();
    }

    lastFetchRef.current = now;
    setIsLoading(true);
    setError(null);

    const apis = [
      {
        name: 'trivia',
        url: 'https://the-trivia-api.com/v2/questions?limit=1',
        parse: (data: any) => ({
          text: `${data[0].question.text} 🤔\n\nAnswer: ${data[0].correctAnswer}`,
          type: 'trivia' as ContentType,
          isLive: true,
          source: 'The Trivia API',
        }),
      },
      {
        name: 'fact',
        url: 'https://uselessfacts.jsph.pl/random.json?language=en',
        parse: (data: any) => ({
          text: data.text,
          type: 'fact' as ContentType,
          isLive: true,
          source: 'Useless Facts',
        }),
      },
      {
        name: 'quote',
        url: 'https://api.quotable.io/random',
        parse: (data: any) => ({
          text: `"${data.content}" - ${data.author}`,
          type: 'quote' as ContentType,
          isLive: true,
          source: 'Quotable',
        }),
      },
      {
        name: 'number',
        url: 'http://numbersapi.com/random/trivia?json',
        parse: (data: any) => ({
          text: data.text,
          type: 'fact' as ContentType,
          isLive: true,
          source: 'Numbers API',
        }),
      },
    ];

    // Pick a random API
    const api = apis[Math.floor(Math.random() * apis.length)];

    // Check cache first
    const cacheKey = api.name;
    const cached = cacheRef.current.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      setIsLoading(false);
      return cached.content;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(api.url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const content = api.parse(data);

      // Cache the result
      cacheRef.current.set(cacheKey, {
        content,
        timestamp: now,
      });

      setIsLoading(false);
      return content;
    } catch (err) {
      console.warn(`Failed to fetch from ${api.name}:`, err);
      setError(`Couldn't fetch live content`);
      setIsLoading(false);
      return getStaticContent();
    }
  }, [getStaticContent]);

  // Get content (hybrid approach)
  const getContent = useCallback(async (preferLive = true): Promise<ContentItem> => {
    if (preferLive) {
      return fetchLiveContent();
    }
    return getStaticContent();
  }, [fetchLiveContent, getStaticContent]);

  // Get greeting specifically
  const getGreeting = useCallback((): ContentItem => {
    return getStaticContent('greeting');
  }, [getStaticContent]);

  return {
    getContent,
    getStaticContent,
    getGreeting,
    isLoading,
    error,
  };
}
