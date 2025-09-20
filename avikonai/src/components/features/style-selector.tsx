'use client';

import { StylePreset } from '@/types';
import { cn } from '@/lib/utils';

interface StyleSelectorProps {
  styles: StylePreset[];
  selectedStyle: StylePreset;
  onStyleChange: (style: StylePreset) => void;
}

const categoryColors = {
  professional: 'from-blue-500 to-blue-600',
  artistic: 'from-purple-500 to-purple-600',
  gaming: 'from-green-500 to-green-600',
  creative: 'from-orange-500 to-orange-600'
};

export function StyleSelector({ styles, selectedStyle, onStyleChange }: StyleSelectorProps) {
  const groupedStyles = styles.reduce((acc, style) => {
    if (!acc[style.category]) {
      acc[style.category] = [];
    }
    acc[style.category].push(style);
    return acc;
  }, {} as Record<string, StylePreset[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groupedStyles).map(([category, categoryStyles]) => (
        <div key={category}>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
            {category}
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {categoryStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => onStyleChange(style)}
                className={cn(
                  'relative p-4 rounded-lg border text-left transition-all duration-200 hover:shadow-md',
                  selectedStyle.id === style.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                {/* Category indicator */}
                <div className={cn(
                  'absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-r',
                  categoryColors[style.category]
                )} />

                <div className="pr-6">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                    {style.name}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {style.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                    Example: {style.example}
                  </p>
                </div>

                {/* Selection indicator */}
                {selectedStyle.id === style.id && (
                  <div className="absolute inset-0 rounded-lg ring-2 ring-blue-500 ring-opacity-50" />
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}