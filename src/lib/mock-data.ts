import { StylePreset, GeneratedImage } from '@/types';

export const stylePresets: StylePreset[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean, business-appropriate headshots with neutral backgrounds',
    example: 'Professional headshot, business attire, clean background, confident expression',
    category: 'professional'
  },
  {
    id: 'artistic',
    name: 'Artistic Portrait',
    description: 'Creative, stylized portraits with artistic flair',
    example: 'Artistic portrait, oil painting style, dramatic lighting, expressive',
    category: 'artistic'
  },
  {
    id: 'gaming',
    name: 'Gaming Avatar',
    description: 'Fantasy and sci-fi inspired gaming character portraits',
    example: 'Fantasy warrior, detailed armor, mystical background, heroic pose',
    category: 'gaming'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Simple, clean designs with focus on essential elements',
    example: 'Minimalist portrait, simple background, clean lines, modern aesthetic',
    category: 'creative'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic, neon-lit cyberpunk aesthetic',
    example: 'Cyberpunk character, neon lights, futuristic cityscape, high-tech implants',
    category: 'creative'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic, retro-inspired portraits with timeless appeal',
    example: 'Vintage portrait, classic clothing, sepia tones, timeless elegance',
    category: 'artistic'
  }
];

export const samplePrompts = [
  'Professional headshot of a confident person in business attire',
  'Artistic portrait with dramatic lighting and painterly style',
  'Fantasy warrior with intricate armor and mystical background',
  'Minimalist portrait with clean lines and modern aesthetic',
  'Cyberpunk character with neon accents and futuristic elements',
  'Vintage-style portrait with classic elegance and sepia tones'
];

// Placeholder images for empty states
export const placeholderImages = {
  upload: "data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100' height='100' fill='%23f3f4f6'/%3e%3ctext x='50%25' y='50%25' font-size='14' fill='%236b7280' text-anchor='middle' dy='.3em'%3eUpload%3c/text%3e%3c/svg%3e",
  empty: "data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100' height='100' fill='%23f9fafb'/%3e%3ctext x='50%25' y='50%25' font-size='12' fill='%239ca3af' text-anchor='middle' dy='.3em'%3eNo images%3c/text%3e%3c/svg%3e"
};