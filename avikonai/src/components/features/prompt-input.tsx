'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Lightbulb, Shuffle } from 'lucide-react';
import { samplePrompts } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export function PromptInput({ value, onChange, placeholder, maxLength = 500 }: PromptInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleRandomPrompt = () => {
    const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
    onChange(randomPrompt);
  };

  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          maxLength={maxLength}
          className="resize-none"
        />

        {/* Character counter */}
        <div className={cn(
          'absolute bottom-2 right-2 text-xs',
          isNearLimit ? 'text-orange-500' : 'text-gray-400'
        )}>
          {characterCount}/{maxLength}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="flex-1"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          {showSuggestions ? 'Hide' : 'Show'} Examples
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRandomPrompt}
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Random
        </Button>
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Example prompts:
          </p>
          <div className="grid gap-2">
            {samplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(prompt)}
                className="text-left p-3 text-sm bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}