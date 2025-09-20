'use client';

import { GenerationSettings as IGenerationSettings } from '@/types';
import { Textarea } from '@/components/ui/textarea';

interface GenerationSettingsProps {
  settings: IGenerationSettings;
  onSettingsChange: (settings: IGenerationSettings) => void;
}

export function GenerationSettings({ settings, onSettingsChange }: GenerationSettingsProps) {
  const updateSetting = <K extends keyof IGenerationSettings>(
    key: K,
    value: IGenerationSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Quality Slider */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Quality Level: {settings.quality}/10
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={settings.quality}
          onChange={(e) => updateSetting('quality', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: '1:1', label: 'Square (1:1)' },
            { value: '4:3', label: 'Standard (4:3)' },
            { value: '16:9', label: 'Wide (16:9)' },
            { value: '9:16', label: 'Portrait (9:16)' }
          ].map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => updateSetting('aspectRatio', ratio.value as any)}
              className={`p-3 text-sm rounded-lg border transition-colors ${
                settings.aspectRatio === ratio.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              {ratio.label}
            </button>
          ))}
        </div>
      </div>

      {/* Negative Prompt */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Negative Prompt (Optional)
        </label>
        <Textarea
          value={settings.negativePrompt || ''}
          onChange={(e) => updateSetting('negativePrompt', e.target.value)}
          placeholder="What you don't want in the image..."
          rows={2}
          maxLength={200}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Describe elements you want to avoid in the generated image
        </p>
      </div>
    </div>
  );
}