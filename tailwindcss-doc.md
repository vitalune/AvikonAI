# Tailwind CSS Reference Guide for Claude Code

## Core Tailwind Concepts

### Utility-First CSS Philosophy

Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs directly in your markup. Instead of writing custom CSS, you compose styling by combining small, single-purpose utility classes.

```html
<!-- Traditional CSS approach -->
<div class="chat-notification">
  <div class="chat-notification-logo-wrapper">
    <img class="chat-notification-logo" src="/img/logo.svg" alt="ChitChat Logo">
  </div>
  <div class="chat-notification-content">
    <h4 class="chat-notification-title">ChitChat</h4>
    <p class="chat-notification-message">You have a new message!</p>
  </div>
</div>

<!-- Tailwind utility-first approach -->
<div class="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg">
  <img class="size-12 shrink-0" src="/img/logo.svg" alt="ChitChat Logo" />
  <div>
    <div class="text-xl font-medium text-black">ChitChat</div>
    <p class="text-gray-500">You have a new message!</p>
  </div>
</div>
```

### Class Naming Conventions

Tailwind uses predictable class naming patterns:

```html
<!-- Property-value pattern -->
<div class="bg-blue-500">        <!-- background-color: rgb(59 130 246) -->
<div class="text-lg">           <!-- font-size: 1.125rem -->
<div class="p-4">               <!-- padding: 1rem -->
<div class="rounded-lg">        <!-- border-radius: 0.5rem -->

<!-- Responsive prefixes -->
<div class="w-16 md:w-32 lg:w-48">  <!-- Different widths at different breakpoints -->

<!-- State prefixes -->
<button class="bg-blue-500 hover:bg-blue-700">  <!-- Hover states -->

<!-- Arbitrary values -->
<div class="bg-[#316ff6]">      <!-- Custom color value -->
<div class="top-[117px]">       <!-- Custom position value -->
```

### Layout Utilities

#### Flexbox Layout

```html
<!-- Basic flex container -->
<div class="flex">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Flex direction and alignment -->
<div class="flex flex-col items-center justify-between h-screen">
  <header class="w-full bg-gray-100 p-4">Header</header>
  <main class="flex-1 p-4">Main Content</main>
  <footer class="w-full bg-gray-100 p-4">Footer</footer>
</div>

<!-- Responsive flexbox -->
<div class="flex flex-col sm:flex-row sm:items-center sm:gap-6">
  <img class="mx-auto block h-24 rounded-full sm:mx-0 sm:shrink-0" src="..." />
  <div class="space-y-2 text-center sm:text-left">
    <p class="text-lg font-semibold">Erin Lindford</p>
    <p class="font-medium text-gray-500">Product Engineer</p>
  </div>
</div>
```

#### Grid Layout

```html
<!-- Basic grid -->
<div class="grid grid-cols-3 gap-4">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <!-- Items adapt from 1 column on mobile to 4 columns on large screens -->
</div>

<!-- Complex grid with spanning -->
<div class="grid grid-cols-6 gap-4">
  <div class="col-span-2">Span 2 columns</div>
  <div class="col-span-4">Span 4 columns</div>
  <div class="col-span-3">Span 3 columns</div>
  <div class="col-span-3">Span 3 columns</div>
</div>

<!-- Grid with custom column sizes -->
<div class="grid grid-cols-[24rem_2.5rem_minmax(0,1fr)] gap-4">
  <div>Fixed 24rem</div>
  <div>Fixed 2.5rem</div>
  <div>Flexible remaining space</div>
</div>
```

#### Positioning

```html
<!-- Absolute positioning -->
<div class="relative">
  <img src="..." alt="..." />
  <div class="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
    <svg class="w-4 h-4">...</svg>
  </div>
</div>

<!-- Fixed positioning -->
<div class="fixed top-0 left-0 w-full bg-white shadow-md z-50">
  Navigation Bar
</div>

<!-- Sticky positioning -->
<div class="sticky top-0 bg-white border-b">
  Sticky Header
</div>
```

### Spacing System

Tailwind uses a consistent spacing scale based on rem units:

```html
<!-- Margin -->
<div class="m-4">        <!-- margin: 1rem (all sides) -->
<div class="mx-auto">    <!-- margin-left: auto; margin-right: auto; -->
<div class="mt-8 mb-4">  <!-- margin-top: 2rem; margin-bottom: 1rem; -->

<!-- Padding -->
<div class="p-6">        <!-- padding: 1.5rem (all sides) -->
<div class="px-4 py-2">  <!-- padding-left/right: 1rem; padding-top/bottom: 0.5rem; -->

<!-- Gap (for flex and grid) -->
<div class="flex gap-4">     <!-- gap: 1rem -->
<div class="grid gap-x-2 gap-y-4"> <!-- column-gap: 0.5rem; row-gap: 1rem; -->

<!-- Space between (for flex children) -->
<div class="flex space-x-4">  <!-- margin-left on all children except first -->
<div class="space-y-2">       <!-- margin-top on all children except first -->
```

### Typography and Color Utilities

#### Typography

```html
<!-- Font families -->
<p class="font-sans">Sans-serif font</p>
<p class="font-serif">Serif font</p>
<p class="font-mono">Monospace font</p>

<!-- Font sizes -->
<h1 class="text-4xl">Extra large heading</h1>
<h2 class="text-2xl">Large heading</h2>
<p class="text-base">Body text</p>
<small class="text-sm">Small text</small>

<!-- Font weights -->
<p class="font-light">Light text</p>
<p class="font-normal">Normal text</p>
<p class="font-semibold">Semi-bold text</p>
<p class="font-bold">Bold text</p>

<!-- Text alignment -->
<p class="text-left">Left aligned</p>
<p class="text-center">Center aligned</p>
<p class="text-right">Right aligned</p>

<!-- Line height and letter spacing -->
<p class="leading-tight tracking-wide">Tight line height, wide letter spacing</p>
```

#### Colors

```html
<!-- Text colors -->
<p class="text-gray-900">Dark gray text</p>
<p class="text-blue-600">Blue text</p>
<p class="text-red-500">Red text</p>

<!-- Background colors -->
<div class="bg-white">White background</div>
<div class="bg-gray-100">Light gray background</div>
<div class="bg-blue-500">Blue background</div>

<!-- Border colors -->
<div class="border border-gray-300">Gray border</div>
<div class="border-2 border-blue-500">Blue border</div>

<!-- Color opacity -->
<div class="bg-blue-500/50">50% opacity blue background</div>
<div class="text-red-600/75">75% opacity red text</div>

<!-- Custom colors with arbitrary values -->
<div class="bg-[#316ff6]">Custom hex color</div>
<div class="text-[rgb(59,130,246)]">Custom RGB color</div>
```

### Responsive Design Breakpoints

Tailwind uses a mobile-first approach with these default breakpoints:

```html
<!-- Breakpoint reference -->
<!-- sm: 640px and up -->
<!-- md: 768px and up -->
<!-- lg: 1024px and up -->
<!-- xl: 1280px and up -->
<!-- 2xl: 1536px and up -->

<!-- Mobile-first responsive design -->
<div class="w-full sm:w-1/2 lg:w-1/3">
  <!-- Full width on mobile, half on small screens, one-third on large -->
</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  <!-- 1 column on mobile, scales up to 4 columns on large screens -->
</div>

<!-- Responsive text -->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Responsive heading
</h1>

<!-- Hide/show at different breakpoints -->
<div class="block md:hidden">Mobile only</div>
<div class="hidden md:block">Desktop only</div>

<!-- Target specific breakpoint ranges -->
<div class="md:max-lg:flex">Only flex between medium and large breakpoints</div>
```

## Project-Specific Tailwind Patterns

### Image Container and Gallery Layouts

```html
<!-- Basic image container with aspect ratio -->
<div class="aspect-square overflow-hidden rounded-lg bg-gray-100">
  <img
    src="..."
    alt="..."
    class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
  />
</div>

<!-- Responsive image grid gallery -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
  <div class="aspect-square overflow-hidden rounded-lg bg-gray-100 hover:shadow-lg transition-shadow duration-200">
    <img src="..." alt="..." class="w-full h-full object-cover" />
  </div>
  <!-- More images... -->
</div>

<!-- Masonry-style gallery with columns -->
<div class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
  <img class="w-full rounded-lg mb-4" src="..." alt="..." />
  <img class="w-full rounded-lg mb-4" src="..." alt="..." />
  <!-- More images... -->
</div>

<!-- Image with overlay and actions -->
<div class="relative group overflow-hidden rounded-lg">
  <img src="..." alt="..." class="w-full h-full object-cover" />
  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200">
    <div class="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div class="flex justify-between items-center text-white">
        <span class="text-sm font-medium">Generated Image</span>
        <div class="flex gap-2">
          <button class="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <svg class="w-4 h-4" fill="currentColor">...</svg>
          </button>
          <button class="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <svg class="w-4 h-4" fill="currentColor">...</svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

### File Upload Dropzone Styling

```html
<!-- Basic dropzone -->
<div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
    <!-- Upload icon -->
  </svg>
  <div class="mt-4">
    <label class="cursor-pointer">
      <span class="mt-2 block text-sm font-medium text-gray-900">
        Click to upload or drag and drop
      </span>
      <span class="block text-xs text-gray-500 mt-1">
        PNG, JPG, GIF up to 10MB
      </span>
      <input type="file" class="sr-only" />
    </label>
  </div>
</div>

<!-- Interactive dropzone with states -->
<div class="group border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200">
  <div class="space-y-4">
    <svg class="mx-auto h-16 w-16 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <!-- Upload icon -->
    </svg>
    <div>
      <p class="text-lg font-medium text-gray-700 group-hover:text-blue-600">
        Drop your image here
      </p>
      <p class="text-sm text-gray-500">or click to browse</p>
    </div>
    <input type="file" class="sr-only" accept="image/*" />
  </div>
</div>

<!-- Dropzone with preview -->
<div class="space-y-4">
  <!-- Dropzone -->
  <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
    <!-- Upload content -->
  </div>

  <!-- Preview area -->
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    <div class="relative group">
      <img src="preview.jpg" alt="Preview" class="w-full aspect-square object-cover rounded-lg" />
      <button class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        <svg class="w-4 h-4" fill="currentColor"><!-- X icon --></svg>
      </button>
    </div>
  </div>
</div>
```

### Loading Spinners and Progress Indicators

```html
<!-- Simple spinning loader -->
<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>

<!-- Spinner with ring -->
<div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>

<!-- Pulsing dots loader -->
<div class="flex space-x-2">
  <div class="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
  <div class="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
  <div class="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
</div>

<!-- Progress bar -->
<div class="w-full bg-gray-200 rounded-full h-2">
  <div class="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out" style="width: 45%"></div>
</div>

<!-- Skeleton loader for images -->
<div class="animate-pulse">
  <div class="aspect-square bg-gray-300 rounded-lg"></div>
  <div class="mt-2 space-y-2">
    <div class="h-4 bg-gray-300 rounded w-3/4"></div>
    <div class="h-4 bg-gray-300 rounded w-1/2"></div>
  </div>
</div>

<!-- Loading overlay for image generation -->
<div class="relative">
  <img src="..." alt="..." class="w-full h-full object-cover opacity-50" />
  <div class="absolute inset-0 flex items-center justify-center bg-white/80">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-sm font-medium text-gray-700">Generating image...</p>
    </div>
  </div>
</div>
```

### Modal and Overlay Components

```html
<!-- Modal backdrop and container -->
<div class="fixed inset-0 z-50 overflow-y-auto">
  <!-- Backdrop -->
  <div class="fixed inset-0 bg-black/50 transition-opacity"></div>

  <!-- Modal -->
  <div class="flex min-h-full items-center justify-center p-4">
    <div class="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
      <!-- Modal header -->
      <div class="flex items-center justify-between p-6 border-b">
        <h3 class="text-lg font-semibold text-gray-900">Image Preview</h3>
        <button class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <!-- Close icon -->
          </svg>
        </button>
      </div>

      <!-- Modal body -->
      <div class="p-6">
        <img src="..." alt="..." class="w-full rounded-lg" />
      </div>

      <!-- Modal footer -->
      <div class="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
        <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Save
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Slide-over panel -->
<div class="fixed inset-0 z-50 overflow-hidden">
  <div class="absolute inset-0 bg-black/50"></div>
  <div class="fixed inset-y-0 right-0 flex max-w-full pl-10">
    <div class="w-screen max-w-md bg-white shadow-xl">
      <div class="flex h-full flex-col">
        <!-- Header -->
        <div class="border-b px-6 py-4">
          <h2 class="text-lg font-semibold">Image Settings</h2>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Settings content -->
        </div>

        <!-- Footer -->
        <div class="border-t px-6 py-4">
          <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Button Variants for Actions

```html
<!-- Primary action buttons -->
<button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Generate Image
</button>

<!-- Secondary buttons -->
<button class="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors">
  Cancel
</button>

<!-- Destructive actions -->
<button class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
  Delete
</button>

<!-- Icon buttons -->
<button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
  <svg class="w-5 h-5" fill="currentColor"><!-- Icon --></svg>
</button>

<!-- Button with loading state -->
<button class="inline-flex items-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors" disabled>
  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
    <!-- Spinner icon -->
  </svg>
  Generating...
</button>

<!-- Button group -->
<div class="inline-flex rounded-lg shadow-sm" role="group">
  <button class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100">
    Edit
  </button>
  <button class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100">
    Download
  </button>
  <button class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100">
    Share
  </button>
</div>

<!-- Floating action button -->
<button class="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all">
  <svg class="w-6 h-6" fill="currentColor"><!-- Plus icon --></svg>
</button>
```

### Form Styling for Inputs and Settings

```html
<!-- Text input -->
<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">Prompt</label>
  <textarea
    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
    rows="3"
    placeholder="Describe the image you want to generate..."
  ></textarea>
</div>

<!-- Select dropdown -->
<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">Style</label>
  <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
    <option>Photorealistic</option>
    <option>Artistic</option>
    <option>Cartoon</option>
  </select>
</div>

<!-- Range slider -->
<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">Quality</label>
  <input
    type="range"
    min="1"
    max="10"
    value="5"
    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
  />
  <div class="flex justify-between text-xs text-gray-500">
    <span>Low</span>
    <span>High</span>
  </div>
</div>

<!-- Checkbox group -->
<div class="space-y-3">
  <label class="block text-sm font-medium text-gray-700">Options</label>
  <div class="space-y-2">
    <label class="flex items-center">
      <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
      <span class="ml-2 text-sm text-gray-700">High resolution</span>
    </label>
    <label class="flex items-center">
      <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
      <span class="ml-2 text-sm text-gray-700">Remove background</span>
    </label>
  </div>
</div>

<!-- Radio group -->
<div class="space-y-3">
  <label class="block text-sm font-medium text-gray-700">Aspect Ratio</label>
  <div class="flex gap-4">
    <label class="flex items-center">
      <input type="radio" name="aspect" value="square" class="text-blue-600 focus:ring-blue-500">
      <span class="ml-2 text-sm text-gray-700">Square</span>
    </label>
    <label class="flex items-center">
      <input type="radio" name="aspect" value="portrait" class="text-blue-600 focus:ring-blue-500">
      <span class="ml-2 text-sm text-gray-700">Portrait</span>
    </label>
    <label class="flex items-center">
      <input type="radio" name="aspect" value="landscape" class="text-blue-600 focus:ring-blue-500">
      <span class="ml-2 text-sm text-gray-700">Landscape</span>
    </label>
  </div>
</div>
```

## Modern UI Design Patterns

### Dark/Light Mode Implementation

```html
<!-- Toggle button -->
<button class="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
  <!-- Sun icon for light mode, moon icon for dark mode -->
  <svg class="w-5 h-5 hidden dark:block" fill="currentColor"><!-- Moon --></svg>
  <svg class="w-5 h-5 block dark:hidden" fill="currentColor"><!-- Sun --></svg>
</button>

<!-- Cards with dark mode -->
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/20 p-6">
  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Card Title</h3>
  <p class="text-gray-600 dark:text-gray-300 mt-2">Card content goes here.</p>
</div>

<!-- Form elements with dark mode -->
<input
  type="text"
  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
  placeholder="Enter text..."
/>

<!-- Navigation with dark mode -->
<nav class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex items-center">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">App Name</h1>
      </div>
    </div>
  </div>
</nav>
```

### Glassmorphism and Modern Card Designs

```html
<!-- Glassmorphism card -->
<div class="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/50 rounded-xl shadow-xl p-6">
  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Glassmorphism Card</h3>
  <p class="text-gray-600 dark:text-gray-300 mt-2">Beautiful translucent design.</p>
</div>

<!-- Modern elevated card -->
<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-gray-200/50 dark:shadow-gray-900/50 p-8 border border-gray-100 dark:border-gray-700">
  <div class="space-y-4">
    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
      <svg class="w-6 h-6 text-white" fill="currentColor"><!-- Icon --></svg>
    </div>
    <h3 class="text-xl font-bold text-gray-900 dark:text-white">Feature Title</h3>
    <p class="text-gray-600 dark:text-gray-300">Feature description with modern styling.</p>
  </div>
</div>

<!-- Gradient border card -->
<div class="p-[1px] bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
  <div class="bg-white dark:bg-gray-900 rounded-xl p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Gradient Border</h3>
    <p class="text-gray-600 dark:text-gray-300 mt-2">Card with gradient border effect.</p>
  </div>
</div>

<!-- Neumorphism-inspired design -->
<div class="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 shadow-inner">
  <div class="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Neumorphism Style</h3>
    <p class="text-gray-600 dark:text-gray-300 mt-2">Soft, inset design pattern.</p>
  </div>
</div>
```

### Hover Effects and Micro-interactions

```html
<!-- Hover scale and shadow -->
<div class="transform hover:scale-105 hover:shadow-xl transition-all duration-200 cursor-pointer">
  <img src="..." alt="..." class="rounded-lg" />
</div>

<!-- Hover tilt effect -->
<div class="transform hover:-rotate-1 hover:scale-105 transition-transform duration-200">
  <div class="bg-white rounded-lg shadow-md p-6">Card content</div>
</div>

<!-- Hover reveal overlay -->
<div class="relative group overflow-hidden rounded-lg">
  <img src="..." alt="..." class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <div class="absolute bottom-4 left-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
      <h3 class="font-semibold">Image Title</h3>
      <p class="text-sm opacity-90">Image description</p>
    </div>
  </div>
</div>

<!-- Button hover animations -->
<button class="relative overflow-hidden bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
  <span class="relative z-10">Hover Me</span>
  <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
</button>

<!-- Animated icon buttons -->
<button class="group p-3 bg-gray-100 hover:bg-blue-100 rounded-full transition-colors duration-200">
  <svg class="w-6 h-6 text-gray-600 group-hover:text-blue-600 transform group-hover:scale-110 transition-all duration-200">
    <!-- Icon -->
  </svg>
</button>
```

### Mobile-First Responsive Image Galleries

```html
<!-- Responsive masonry grid -->
<div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
  <div class="break-inside-avoid">
    <img src="..." alt="..." class="w-full rounded-lg mb-4" />
  </div>
  <!-- More images -->
</div>

<!-- Touch-friendly gallery with swipe indicators -->
<div class="relative">
  <!-- Mobile: horizontal scroll -->
  <div class="flex gap-4 overflow-x-auto pb-4 sm:hidden snap-x snap-mandatory">
    <div class="flex-none w-64 snap-start">
      <img src="..." alt="..." class="w-full aspect-square object-cover rounded-lg" />
    </div>
    <!-- More images -->
  </div>

  <!-- Desktop: grid layout -->
  <div class="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div class="aspect-square overflow-hidden rounded-lg">
      <img src="..." alt="..." class="w-full h-full object-cover hover:scale-105 transition-transform duration-200" />
    </div>
    <!-- More images -->
  </div>
</div>

<!-- Infinite scroll gallery -->
<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
  <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
    <img
      src="..."
      alt="..."
      class="w-full h-full object-cover hover:opacity-80 transition-opacity cursor-pointer"
      loading="lazy"
    />
  </div>
  <!-- More images with lazy loading -->
</div>
```

### Accessibility Utilities

```html
<!-- Screen reader only content -->
<span class="sr-only">Close dialog</span>

<!-- Focus management -->
<button class="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
  Accessible Button
</button>

<!-- High contrast mode support -->
<div class="border border-gray-300 contrast-more:border-gray-900 dark:border-gray-600 dark:contrast-more:border-gray-100">
  Content with high contrast support
</div>

<!-- Skip links -->
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50">
  Skip to main content
</a>

<!-- Proper form labels and ARIA -->
<div class="space-y-2">
  <label for="image-prompt" class="block text-sm font-medium text-gray-700">
    Image Prompt
  </label>
  <textarea
    id="image-prompt"
    aria-describedby="prompt-help"
    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    placeholder="Describe your image..."
  ></textarea>
  <p id="prompt-help" class="text-sm text-gray-500">
    Be specific about colors, style, and composition for best results.
  </p>
</div>

<!-- Loading states with ARIA -->
<button
  aria-live="polite"
  aria-label={isLoading ? "Generating image, please wait" : "Generate image"}
  class="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
  disabled={isLoading}
>
  {isLoading ? "Generating..." : "Generate"}
</button>
```

### Animation and Transition Utilities

```html
<!-- CSS Animations -->
<div class="animate-spin">Spinning element</div>
<div class="animate-pulse">Pulsing element</div>
<div class="animate-bounce">Bouncing element</div>
<div class="animate-ping">Pinging element</div>

<!-- Custom transitions -->
<div class="transition-all duration-300 ease-in-out hover:scale-105">
  Smooth transition
</div>

<!-- Staggered animations -->
<div class="space-y-2">
  <div class="transform translate-x-0 transition-transform duration-300 delay-100">Item 1</div>
  <div class="transform translate-x-0 transition-transform duration-300 delay-200">Item 2</div>
  <div class="transform translate-x-0 transition-transform duration-300 delay-300">Item 3</div>
</div>

<!-- Fade in animation -->
<div class="opacity-0 animate-fade-in">
  <img src="..." alt="..." onload="this.parentElement.classList.add('opacity-100')" />
</div>

<!-- Loading skeleton with animation -->
<div class="animate-pulse space-y-4">
  <div class="h-4 bg-gray-300 rounded w-3/4"></div>
  <div class="h-4 bg-gray-300 rounded w-1/2"></div>
  <div class="h-32 bg-gray-300 rounded"></div>
</div>
```

## Integration Guidelines

### Organizing Tailwind Classes in React Components

```jsx
// Use classnames library for conditional styling
import classNames from 'classnames';

function ImageCard({ image, isSelected, onSelect }) {
  const cardClasses = classNames(
    // Base styles
    'relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-200',
    // Conditional styles
    {
      'ring-2 ring-blue-500 shadow-lg': isSelected,
      'hover:shadow-lg hover:-translate-y-1': !isSelected,
    }
  );

  return (
    <div className={cardClasses} onClick={() => onSelect(image.id)}>
      <img
        src={image.thumbnail}
        alt={image.alt}
        className="w-full aspect-square object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
        <div className="absolute bottom-2 left-2 text-white text-sm font-medium">
          {image.title}
        </div>
      </div>
    </div>
  );
}

// Extract common button styles into constants
const buttonStyles = {
  base: 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  sizes: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  },
  variants: {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  }
};

function Button({ variant = 'primary', size = 'md', children, ...props }) {
  const className = classNames(
    buttonStyles.base,
    buttonStyles.sizes[size],
    buttonStyles.variants[variant]
  );

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
```

### Custom Component Patterns with @apply

```css
/* In your CSS file */
@layer components {
  .btn {
    @apply inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
  }

  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
  }

  .btn-secondary {
    @apply bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500;
  }

  .card {
    @apply bg-white rounded-lg shadow-md overflow-hidden;
  }

  .card-header {
    @apply px-6 py-4 border-b border-gray-200;
  }

  .card-body {
    @apply px-6 py-4;
  }

  .form-input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
  }

  .image-gallery {
    @apply grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4;
  }

  .image-thumbnail {
    @apply aspect-square overflow-hidden rounded-lg bg-gray-100 hover:shadow-lg transition-shadow duration-200;
  }
}
```

### Conditional Styling with Dynamic Classes

```jsx
function ImageGenerator({ status, progress }) {
  // Dynamic class generation
  const getStatusColor = (status) => {
    const colors = {
      idle: 'text-gray-500',
      generating: 'text-blue-600',
      success: 'text-green-600',
      error: 'text-red-600',
    };
    return colors[status] || colors.idle;
  };

  const getProgressBarColor = (progress) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-4">
      {/* Status indicator */}
      <div className={`flex items-center space-x-2 ${getStatusColor(status)}`}>
        <div className="w-2 h-2 rounded-full bg-current"></div>
        <span className="text-sm font-medium capitalize">{status}</span>
      </div>

      {/* Progress bar */}
      {status === 'generating' && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(progress)}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}

// Template literal for complex conditions
function ImageCard({ image, isGenerating, hasError }) {
  const containerClasses = `
    relative overflow-hidden rounded-lg transition-all duration-200
    ${isGenerating ? 'opacity-50 pointer-events-none' : 'hover:shadow-lg'}
    ${hasError ? 'ring-2 ring-red-500' : 'shadow-md'}
  `;

  return <div className={containerClasses}>...</div>;
}
```

### Performance Optimization

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Only scan necessary files
    './public/index.html'
  ],
  theme: {
    extend: {
      // Custom values only when needed
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    },
  },
  plugins: [
    // Only include needed plugins
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
  // JIT mode for faster builds
  mode: 'jit',
  // Purge unused styles in production
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
  }
}
```

### Color Palette Customization

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Custom brand colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Main brand color
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Custom semantic colors
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        // Custom grays for better contrast
        'cool-gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      }
    }
  }
}
```

This comprehensive Tailwind CSS guide provides all the essential patterns and utilities needed for building modern, responsive interfaces for AI-powered image generation applications. Use these patterns as building blocks for consistent, maintainable, and performant UI components.