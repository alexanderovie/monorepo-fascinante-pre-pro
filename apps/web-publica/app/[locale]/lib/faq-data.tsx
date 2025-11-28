export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isOpen?: boolean;
}

export const defaultFAQData: FAQItem[] = [
  {
    id: 'why-not-showing',
    question: "Why isn't my business showing on Google?",
    answer:
      'Your profile might not be verified or optimized. Our free audit shows exactly why.',
    isOpen: true,
  },
  {
    id: 'what-included',
    question: "What's included in the free audit?",
    answer:
      "You'll get a complete report with visibility, reviews, and optimization insights.",
  },
  {
    id: 'need-website',
    question: 'Do I need a website to appear on Google?',
    answer:
      'No, but a good website improves your ranking and conversions.',
  },
  {
    id: 'how-long',
    question: 'How long does it take to see results?',
    answer:
      'Most businesses see improvements within 2–4 weeks after optimization.',
  },
  {
    id: 'cancel-anytime',
    question: 'Can I cancel anytime?',
    answer:
      "Absolutely. You're always in control.",
  },
];
