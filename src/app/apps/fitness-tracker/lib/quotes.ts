interface Quote {
  text: string;
  author: string;
}

const fitnessQuotes: Quote[] = [
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown"
  },
  {
    text: "Fitness is not about being better than someone else. It's about being better than you used to be.",
    author: "Khloe Kardashian"
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  },
  {
    text: "The difference between try and triumph is just a little umph!",
    author: "Marvin Phillips"
  },
  {
    text: "The hardest lift of all is lifting your butt off the couch.",
    author: "Unknown"
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    text: "The only place where success comes before work is in the dictionary.",
    author: "Vidal Sassoon"
  },
  {
    text: "The clock is ticking. Are you becoming the person you want to be?",
    author: "Greg Plitt"
  },
  {
    text: "Your body can stand almost anything. It's your mind that you have to convince.",
    author: "Unknown"
  },
  {
    text: "You're only one workout away from a good mood.",
    author: "Unknown"
  },
  {
    text: "Strength does not come from the physical capacity. It comes from an indomitable will.",
    author: "Mahatma Gandhi"
  },
  {
    text: "The pain you feel today will be the strength you feel tomorrow.",
    author: "Arnold Schwarzenegger"
  },
  {
    text: "If it doesn't challenge you, it doesn't change you.",
    author: "Fred DeVito"
  },
  {
    text: "The body achieves what the mind believes.",
    author: "Napoleon Hill"
  },
  {
    text: "Rome wasn't built in a day, but they were laying bricks every hour.",
    author: "John Heywood"
  }
];

export function getRandomQuote(): Quote {
  const randomIndex = Math.floor(Math.random() * fitnessQuotes.length);
  return fitnessQuotes[randomIndex];
}

export function getQuoteOfTheDay(): Quote {
  // Get a quote based on the day of the year (so it changes daily but is consistent throughout the day)
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  // Use the day of year to select a quote
  const index = dayOfYear % fitnessQuotes.length;
  return fitnessQuotes[index];
} 