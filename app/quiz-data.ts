export type PersonalityType =
  | "boldAdventurer"
  | "sweetEnthusiast"
  | "zenMinimalist"
  | "healthNut"
  | "indulgentTreat";

export interface QuizAnswer {
  text: string;
  icon: string;
  personality: PersonalityType;
}

export interface QuizQuestion {
  question: string;
  answers: QuizAnswer[];
}

export interface PersonalityResult {
  id: PersonalityType;
  name: string;
  tagline: string;
  description: string;
  coffeeRecommendation: string;
  coffeeDescription: string;
  image: string;
}

export const questions: QuizQuestion[] = [
  {
    question: "It's Saturday morning. What sounds like the perfect start?",
    answers: [
      {
        text: "Exploring a new neighborhood cafe",
        icon: "🗺️",
        personality: "boldAdventurer",
      },
      {
        text: "Cozy blanket, sweet treat, comfort vibes",
        icon: "🛋️",
        personality: "sweetEnthusiast",
      },
      {
        text: "Quiet moment with a simple cup",
        icon: "🧘",
        personality: "zenMinimalist",
      },
      {
        text: "Morning workout then a clean energy boost",
        icon: "🏃",
        personality: "healthNut",
      },
    ],
  },
  {
    question: "You're ordering for a friend who says 'surprise me.' You pick:",
    answers: [
      {
        text: "Something bold they'd never try themselves",
        icon: "🎲",
        personality: "boldAdventurer",
      },
      {
        text: "A sweet, crowd-pleasing classic",
        icon: "🍰",
        personality: "sweetEnthusiast",
      },
      {
        text: "Simple and reliable - can't go wrong",
        icon: "✨",
        personality: "zenMinimalist",
      },
      {
        text: "A rich, decadent treat to make their day",
        icon: "🎁",
        personality: "indulgentTreat",
      },
    ],
  },
  {
    question: "Your ideal coffee shop atmosphere is:",
    answers: [
      {
        text: "Buzzing with energy, new people to meet",
        icon: "🎉",
        personality: "boldAdventurer",
      },
      {
        text: "Warm, sweet-smelling, like a hug",
        icon: "🤗",
        personality: "sweetEnthusiast",
      },
      {
        text: "Minimal, calm, good natural light",
        icon: "🪴",
        personality: "zenMinimalist",
      },
      {
        text: "Bright and airy, fresh ingredients visible",
        icon: "🌿",
        personality: "healthNut",
      },
    ],
  },
  {
    question: "When trying something new on the menu, you:",
    answers: [
      {
        text: "Go all in - the weirder the better",
        icon: "🚀",
        personality: "boldAdventurer",
      },
      {
        text: "Look for the sweetest-sounding option",
        icon: "🍯",
        personality: "sweetEnthusiast",
      },
      {
        text: "Ask about ingredients and nutrition",
        icon: "📋",
        personality: "healthNut",
      },
      {
        text: "Pick the most indulgent thing on the menu",
        icon: "👑",
        personality: "indulgentTreat",
      },
    ],
  },
  {
    question: "Your friends would describe your taste as:",
    answers: [
      {
        text: "Adventurous - always trying new things",
        icon: "🌍",
        personality: "boldAdventurer",
      },
      {
        text: "Sweet tooth - you never skip dessert",
        icon: "🧁",
        personality: "sweetEnthusiast",
      },
      {
        text: "Simple but intentional",
        icon: "🎯",
        personality: "zenMinimalist",
      },
      {
        text: "Treat yourself - life's too short",
        icon: "💫",
        personality: "indulgentTreat",
      },
    ],
  },
  {
    question: "What matters most in your daily coffee?",
    answers: [
      {
        text: "It should wake me up and keep things interesting",
        icon: "⚡",
        personality: "boldAdventurer",
      },
      {
        text: "It should taste like a little reward",
        icon: "🏆",
        personality: "sweetEnthusiast",
      },
      {
        text: "Pure, clean, no fuss",
        icon: "💧",
        personality: "zenMinimalist",
      },
      {
        text: "Good ingredients I can feel good about",
        icon: "🌱",
        personality: "healthNut",
      },
    ],
  },
];

export const personalities: Record<PersonalityType, PersonalityResult> = {
  boldAdventurer: {
    id: "boldAdventurer",
    name: "Bold Adventurer",
    tagline: "Life's too short for boring coffee",
    description:
      "You're always seeking the next discovery. Whether it's a new roast, an unusual flavor combination, or a coffee shop you've never visited, you thrive on the thrill of the new. Your enthusiasm is contagious, and you're often the one introducing friends to their new favorite drink.",
    coffeeRecommendation: "Double Shot Espresso",
    coffeeDescription:
      "Pure, intense, unapologetic. A concentrated shot of adventure that matches your bold spirit.",
    image: "/images/espresso.jpg",
  },
  sweetEnthusiast: {
    id: "sweetEnthusiast",
    name: "Sweet Enthusiast",
    tagline: "Every cup deserves a little magic",
    description:
      "You believe coffee should be a treat, not a chore. You appreciate the artistry in a perfectly crafted caramel drizzle and know that a little sweetness makes everything better. Your warmth and appreciation for life's pleasures make every coffee break feel special.",
    coffeeRecommendation: "Caramel Latte",
    coffeeDescription:
      "Smooth espresso meets velvety caramel and steamed milk. Sweet, comforting, and always a delight.",
    image: "/images/caramel-latte.jpg",
  },
  zenMinimalist: {
    id: "zenMinimalist",
    name: "Zen Minimalist",
    tagline: "Simplicity is the ultimate sophistication",
    description:
      "You find beauty in simplicity and substance over style. For you, a perfect cup of coffee is about quality beans, careful preparation, and a moment of peace. You appreciate the ritual as much as the drink itself, finding calm in the everyday.",
    coffeeRecommendation: "Black Coffee",
    coffeeDescription:
      "No distractions, just pure coffee. Single-origin, medium roast, brewed with intention.",
    image: "/images/black-coffee.jpg",
  },
  healthNut: {
    id: "healthNut",
    name: "Wellness Wanderer",
    tagline: "Fuel your body, feed your soul",
    description:
      "You see coffee as part of your overall wellness journey. You care about where your beans come from, what goes into your cup, and how it makes you feel. Clean energy and conscious choices guide your decisions, and you inspire others to think about what they consume.",
    coffeeRecommendation: "Oat Milk Americano",
    coffeeDescription:
      "Clean espresso, hot water, and creamy oat milk. Light, refreshing, and plant-powered.",
    image: "/images/oat-milk-americano.jpg",
  },
  indulgentTreat: {
    id: "indulgentTreat",
    name: "Indulgent Treat",
    tagline: "You deserve this moment",
    description:
      "You know that sometimes the best thing you can do is treat yourself. Coffee isn't just a beverage for you—it's an experience, a moment of luxury in a busy day. You appreciate the finer things and aren't afraid to enjoy them fully.",
    coffeeRecommendation: "Mocha",
    coffeeDescription:
      "Rich espresso meets decadent chocolate and whipped cream. A celebration in every sip.",
    image: "/images/mocha.jpg",
  },
};

export const personalityOrder: PersonalityType[] = [
  "boldAdventurer",
  "sweetEnthusiast",
  "zenMinimalist",
  "healthNut",
  "indulgentTreat",
];
