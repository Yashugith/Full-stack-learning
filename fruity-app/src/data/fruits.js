// src/data/fruits.js
// Central data file — all fruit info, recipes, quiz questions, and fun facts
// Import from here so both pages share the same data source

// ── Fruit catalogue (used in Shop + Life tracker) ────────────────────────────
export const FRUITS = [
  { id: 1,  emoji: '🍓', name: 'Strawberry', sub: 'Sweet & fresh',       price: 120, cal: 32,  cat: 'berry',    btnColor: '#ff6b6b', bg: '#fff0f6', border: '#ffaac4', badge: 'Hot',    badgeBg: '#ff6b6b',  badgeColor: '#fff',    stars: 5 },
  { id: 2,  emoji: '🥭', name: 'Mango',      sub: 'King of fruits',      price: 80,  cal: 60,  cat: 'exotic',   btnColor: '#f59f00', bg: '#fff8e1', border: '#ffcc80', badge: 'Fave',   badgeBg: '#fff3e0',  badgeColor: '#e65100', stars: 5 },
  { id: 3,  emoji: '🫐', name: 'Blueberry',  sub: 'Antioxidant rich',    price: 180, cal: 57,  cat: 'berry',    btnColor: '#9c27b0', bg: '#f3e5f5', border: '#ce93d8', badge: '',       badgeBg: '',         badgeColor: '',        stars: 4 },
  { id: 4,  emoji: '🍊', name: 'Orange',     sub: 'Vitamin C boost',     price: 60,  cal: 47,  cat: 'citrus',   btnColor: '#ff9800', bg: '#fff3e0', border: '#ffcc80', badge: 'Fresh',  badgeBg: '#e8f5e9',  badgeColor: '#2e7d32', stars: 4 },
  { id: 5,  emoji: '🍍', name: 'Pineapple',  sub: 'Tropical delight',    price: 90,  cal: 50,  cat: 'tropical', btnColor: '#cddc39', bg: '#fffde7', border: '#fff59d', badge: '',       badgeBg: '',         badgeColor: '',        stars: 4 },
  { id: 6,  emoji: '🍉', name: 'Watermelon', sub: 'Summer special',      price: 50,  cal: 30,  cat: 'tropical', btnColor: '#4caf50', bg: '#e8f5e9', border: '#a5d6a7', badge: 'Sale',   badgeBg: '#e8f5e9',  badgeColor: '#1b5e20', stars: 5 },
  { id: 7,  emoji: '🍇', name: 'Grapes',     sub: 'Seedless variety',    price: 140, cal: 62,  cat: 'exotic',   btnColor: '#673ab7', bg: '#ede7f6', border: '#b39ddb', badge: '',       badgeBg: '',         badgeColor: '',        stars: 4 },
  { id: 8,  emoji: '🍋', name: 'Lemon',      sub: 'Zesty & tangy',       price: 40,  cal: 29,  cat: 'citrus',   btnColor: '#f9a825', bg: '#fffff0', border: '#fff176', badge: 'Organic',badgeBg: '#e8f5e9',  badgeColor: '#1b5e20', stars: 4 },
  { id: 9,  emoji: '🍌', name: 'Banana',     sub: 'Energy booster',      price: 30,  cal: 89,  cat: 'tropical', btnColor: '#ffc107', bg: '#fffde7', border: '#ffe082', badge: '',       badgeBg: '',         badgeColor: '',        stars: 5 },
  { id: 10, emoji: '🍎', name: 'Apple',      sub: 'A-day keeps doc away',price: 70,  cal: 52,  cat: 'exotic',   btnColor: '#e53935', bg: '#fce4ec', border: '#ef9a9a', badge: 'Classic',badgeBg: '#fce4ec',  badgeColor: '#c62828', stars: 5 },
]

// ── Category filters ─────────────────────────────────────────────────────────
export const CATEGORIES = [
  { key: 'all',      label: 'All',     emoji: '🍓', bg: '#fff0f6' },
  { key: 'tropical', label: 'Tropical',emoji: '🌴', bg: '#fff8e1' },
  { key: 'citrus',   label: 'Citrus',  emoji: '🍊', bg: '#fff3e0' },
  { key: 'berry',    label: 'Berries', emoji: '🫐', bg: '#fce4ec' },
  { key: 'exotic',   label: 'Exotic',  emoji: '🥭', bg: '#e8f5e9' },
]

// ── Banner data (hero section per category) ──────────────────────────────────
export const BANNERS = [
  { cat: 'all',      emoji: '🍓', bg: '#fff0f6', tag: '🌟 Today\'s Pick',    title: 'Super Fresh<br/>Strawberries!', btnColor: '#ff6b6b' },
  { cat: 'tropical', emoji: '🍍', bg: '#fffde7', tag: '🌴 Tropical Vibes',   title: 'Sun-Kissed<br/>Pineapple!',    btnColor: '#cddc39' },
  { cat: 'citrus',   emoji: '🍊', bg: '#fff3e0', tag: '⚡ Vitamin Boost',    title: 'Juicy Fresh<br/>Oranges!',     btnColor: '#ff9800' },
  { cat: 'berry',    emoji: '🫐', bg: '#f3e5f5', tag: '💜 Berry Good',       title: 'Ripe Wild<br/>Blueberries!',   btnColor: '#9c27b0' },
  { cat: 'exotic',   emoji: '🥭', bg: '#fff8e1', tag: '👑 King of Fruits',   title: 'Sweet Ripe<br/>Mangoes!',      btnColor: '#f59f00' },
]

// ── Recipes (used in FruityLife → Recipes tab) ───────────────────────────────
export const RECIPES = [
  {
    name: 'Sunrise Smoothie',
    meta: '5 min · Easy · 180 cal',
    emoji: '🥤',
    fruits: ['🍓', '🍌', '🍊'],
    tags: [{ t: 'Breakfast', c: '#e8f5e9', tc: '#2e7d32' }, { t: 'Quick', c: '#e3f2fd', tc: '#1565c0' }],
    steps: ['Add 1 cup strawberries', 'Add 1 banana', 'Squeeze half an orange', 'Blend until smooth', 'Serve chilled 🍹'],
  },
  {
    name: 'Tropical Fruit Bowl',
    meta: '10 min · Easy · 220 cal',
    emoji: '🥣',
    fruits: ['🥭', '🍍', '🍌', '🫐'],
    tags: [{ t: 'Healthy', c: '#e8f5e9', tc: '#2e7d32' }, { t: 'No-cook', c: '#fff3e0', tc: '#e65100' }],
    steps: ['Cube 1 mango and some pineapple', 'Slice a banana', 'Top with blueberries', 'Drizzle honey', 'Garnish with mint 🌿'],
  },
  {
    name: 'Berry Blast Parfait',
    meta: '15 min · Medium · 290 cal',
    emoji: '🍨',
    fruits: ['🍓', '🫐', '🍇'],
    tags: [{ t: 'Dessert', c: '#fce4ec', tc: '#c62828' }, { t: 'Yummy', c: '#fff3e0', tc: '#e65100' }],
    steps: ['Layer Greek yogurt in a glass', 'Add strawberry layer', 'Add blueberry layer', 'Add grapes on top', 'Sprinkle granola 🌟'],
  },
  {
    name: 'Citrus Power Juice',
    meta: '5 min · Easy · 140 cal',
    emoji: '🍹',
    fruits: ['🍊', '🍋'],
    tags: [{ t: 'Detox', c: '#e8f5e9', tc: '#2e7d32' }, { t: 'Vitamin C', c: '#fff8e1', tc: '#f57f17' }],
    steps: ['Squeeze 2 oranges', 'Add juice of 1 lemon', 'Add a pinch of salt', 'Mix with cold water', 'Serve over ice 🧊'],
  },
  {
    name: 'Watermelon Salad',
    meta: '8 min · Easy · 90 cal',
    emoji: '🥗',
    fruits: ['🍉', '🍓', '🫐'],
    tags: [{ t: 'Summer', c: '#e3f2fd', tc: '#1565c0' }, { t: 'Light', c: '#e8f5e9', tc: '#2e7d32' }],
    steps: ['Cube watermelon into chunks', 'Slice strawberries', 'Mix in blueberries', 'Add fresh mint leaves', 'Squeeze lime on top 🍈'],
  },
]

// ── Quiz questions (used in FruityLife → Fun tab) ────────────────────────────
export const QUIZ = [
  { fruit: '🥝', q: 'Which fruit has more Vitamin C than an orange?',    opts: ['Apple',     'Kiwi',     'Grape',     'Mango'],    ans: 1 },
  { fruit: '🍌', q: 'Bananas are technically a...',                       opts: ['Vegetable', 'Berry',    'Drupe',     'Nut'],      ans: 1 },
  { fruit: '🍅', q: 'Is a tomato a fruit or vegetable (botanically)?',   opts: ['Vegetable', 'Fruit',    'Fungus',    'Neither'],  ans: 1 },
  { fruit: '🥑', q: 'Which is the most calorie-dense common fruit?',     opts: ['Mango',     'Avocado',  'Coconut',   'Durian'],   ans: 1 },
  { fruit: '🍎', q: 'Why do apples float in water?',                     opts: ['Hollow inside', '25% air', 'Less density', 'Waxy coat'], ans: 1 },
  { fruit: '🍇', q: 'How long does wine fermentation usually take?',     opts: ['1 day', '1–4 weeks', '6 months', '1 year'],     ans: 1 },
  { fruit: '🍍', q: 'How long does a pineapple take to grow?',           opts: ['3 months', '6 months', '2 years', '5 years'],   ans: 2 },
]

// ── Fun facts (used in FruityLife → Fun tab) ─────────────────────────────────
export const FACTS = [
  { emoji: '🍓', text: 'Strawberries are the only fruit with seeds on the outside — and they\'re not even true berries! 🤯' },
  { emoji: '🍌', text: 'Bananas are mildly radioactive! They contain potassium-40 — completely harmless though. 😂' },
  { emoji: '🍍', text: 'Pineapples take 2 full years to grow, and each plant only produces ONE pineapple per year! 🌿' },
  { emoji: '🍇', text: 'Ancient Egyptians cultivated grapes over 6,000 years ago. Wine is basically a fruit time machine! 🏺' },
  { emoji: '🥭', text: 'India produces 40% of the world\'s mangoes — over 20 million tonnes every year! 🇮🇳' },
  { emoji: '🍉', text: 'Watermelons are 92% water — the most refreshing hydration hack nature ever invented! 💧' },
  { emoji: '🍎', text: 'There are over 7,500 known varieties of apples grown around the world! 🌍' },
  { emoji: '🍋', text: 'Lemons are actually a hybrid of bitter orange and citron — they don\'t exist in the wild! 🌱' },
]

// ── Fruit options for the daily tracker (subset with calorie info) ────────────
export const TRACKER_FRUITS = FRUITS.map(f => ({
  id: f.id,
  emoji: f.emoji,
  name: f.name,
  cal: f.cal,
  btnColor: f.btnColor,
  bg: f.bg,
  border: f.border,
}))
