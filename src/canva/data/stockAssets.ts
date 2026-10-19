import { CanvasPreset } from '../types/canvas';

export const CANVAS_PRESETS: CanvasPreset[] = [
  {
    id: 'ig-post',
    name: 'Instagram Post',
    width: 1080,
    height: 1080,
    iconName: 'Instagram',
    category: 'social',
  },
  {
    id: 'ig-story',
    name: 'Instagram Story / Reel',
    width: 1080,
    height: 1920,
    iconName: 'Smartphone',
    category: 'social',
  },
  {
    id: 'yt-thumb',
    name: 'YouTube Thumbnail',
    width: 1280,
    height: 720,
    iconName: 'Youtube',
    category: 'social',
  },
  {
    id: 'presentation',
    name: 'Presentation (16:9)',
    width: 1920,
    height: 1080,
    iconName: 'Presentation',
    category: 'presentation',
  },
  {
    id: 'a4-doc',
    name: 'A4 Document / Poster',
    width: 1240,
    height: 1754,
    iconName: 'FileText',
    category: 'print',
  },
  {
    id: 'facebook-banner',
    name: 'Facebook Cover Banner',
    width: 1640,
    height: 924,
    iconName: 'Image',
    category: 'social',
  },
];

export const FONT_FAMILIES = [
  { name: 'Inter (Modern Sans)', value: 'Inter, sans-serif' },
  { name: 'Poppins (Geometric)', value: 'Poppins, sans-serif' },
  { name: 'Montserrat (Bold Clean)', value: 'Montserrat, sans-serif' },
  { name: 'Playfair Display (Luxury Serif)', value: '"Playfair Display", serif' },
  { name: 'Merriweather (Classic Serif)', value: 'Merriweather, serif' },
  { name: 'Oswald (Impact Headline)', value: 'Oswald, sans-serif' },
  { name: 'Dancing Script (Handwritten)', value: '"Dancing Script", cursive' },
  { name: 'Pacifico (Retro Brush)', value: 'Pacifico, cursive' },
  { name: 'Courier Prime (Monospace Code)', value: '"Courier Prime", monospace' },
  { name: 'Impact (Heavy Poster)', value: 'Impact, sans-serif' },
];

export const COLOR_PALETTES = [
  {
    name: 'Canva Essentials',
    colors: ['#00c4cc', '#7d2ae8', '#252627', '#ffffff', '#ff4081', '#ffc107', '#4caf50'],
  },
  {
    name: 'Modern Pastels',
    colors: ['#f8edeb', '#fcd5ce', '#fae1dd', '#d8e2dc', '#ece4db', '#ffe5d9', '#ffd7ba'],
  },
  {
    name: 'Vibrant Neon',
    colors: ['#ff007f', '#00f0ff', '#ffe600', '#7000ff', '#00ff66', '#ff4d00', '#111827'],
  },
  {
    name: 'Earth & Nature',
    colors: ['#2d3748', '#4a5568', '#718096', '#2c5282', '#276749', '#744210', '#9c4221'],
  },
  {
    name: 'Luxury Dark Gold',
    colors: ['#121212', '#1e1e24', '#d4af37', '#e5c158', '#f3e5ab', '#ffffff', '#8a795d'],
  },
];

export const GRADIENT_PRESETS = [
  { name: 'Canva Aura', value: 'linear-gradient(135deg, #00c4cc 0%, #7d2ae8 100%)' },
  { name: 'Sunset Glow', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Ocean Depths', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Neon Cyber', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: 'Midnight Purple', value: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
  { name: 'Lush Forest', value: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)' },
  { name: 'Clean Silver', value: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' },
  { name: 'Obsidian Dark', value: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' },
];

export const STOCK_PHOTOS = [
  {
    id: 'p1',
    title: 'Minimalist Workspace',
    category: 'Business',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'p2',
    title: 'Sunset Mountains',
    category: 'Nature',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'p3',
    title: 'Creative Neon Fluid',
    category: 'Abstract',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'p4',
    title: 'City Architecture',
    category: 'Urban',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'p5',
    title: 'Modern Coffee Vibes',
    category: 'Lifestyle',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'p6',
    title: 'Tech Coding Matrix',
    category: 'Tech',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=70',
  },
];
