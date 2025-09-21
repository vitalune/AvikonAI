'use client';

import { GeneratedImage } from '@/types';

const KEY = 'app.images';

type StoredImage = {
  id: string;
  url: string; // data URL
  prompt: string;
  style: string;
  timestamp: string; // ISO
  isGenerated?: boolean;
};

export function loadStoredImages(): GeneratedImage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    const list: StoredImage[] = raw ? JSON.parse(raw) : [];
    return list.map((it) => ({
      id: it.id,
      url: it.url,
      prompt: it.prompt,
      style: it.style,
      timestamp: new Date(it.timestamp),
      isGenerated: it.isGenerated ?? true,
    }));
  } catch (e) {
    console.error('Failed to load stored images', e);
    return [];
  }
}
