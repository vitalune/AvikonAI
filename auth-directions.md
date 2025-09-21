# Auth0 Integration Plan for AvikonAI

A comprehensive step-by-step implementation guide for integrating Auth0 authentication into the AvikonAI Next.js 14 application.

## Table of Contents
- [Project Overview](#project-overview)
- [Auth0 Configuration](#auth0-configuration)
- [Environment Setup](#environment-setup)
- [Implementation Steps](#implementation-steps)
- [Component Development](#component-development)
- [Route Protection](#route-protection)
- [Vercel Deployment](#vercel-deployment)
- [Testing](#testing)

## Project Overview

AvikonAI is a Next.js 14 application using the App Router with:
- TypeScript
- Tailwind CSS
- Custom theme provider (light/dark mode)
- Existing components: Header, Button, Toast system
- Current routes: `/`, `/generate`, `/gallery`, `/pricing`

## Auth0 Configuration

### Auth0 Dashboard Setup

1. **Create Auth0 Application**
   - Navigate to Auth0 Dashboard → Applications
   - Click "Create Application"
   - Choose "Regular Web Applications"
   - Select "Next.js" as the technology

2. **Configure Application Settings**
   ```
   Name: AvikonAI
   Application Type: Regular Web Application
   Token Endpoint Authentication Method: Post
   ```

3. **Set Allowed URLs**
   ```
   Allowed Callback URLs:
   - https://avikon-ai.vercel.app/auth/callback

   Allowed Logout URLs:
   - https://avikon-ai.vercel.app

   Allowed Web Origins:
   - https://avikon-ai.vercel.app
   ```

4. **Advanced Settings**
   - Grant Types: Enable "Authorization Code", "Refresh Token"
   - Refresh Token Behavior: Rotating
   - Refresh Token Expiration: 30 days

## Environment Setup

### Local Development (.env.local)
```env
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-auth0-domain.us.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
```

### Vercel Environment Variables
```env
AUTH0_SECRET='production-secret-32-bytes'
AUTH0_BASE_URL='https://avikon-ai.vercel.app'
AUTH0_ISSUER_BASE_URL='https://your-auth0-domain.us.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
```

## Implementation Steps

### Step 1: Install Auth0 Dependencies

```bash
npm install @auth0/nextjs-auth0
```

### Step 2: Create Auth0 Client Instance

Create `avikonai/src/lib/auth0.ts`:
```typescript
import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client();
```

### Step 3: Configure Middleware

Create `avikonai/middleware.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth0 } from "./src/lib/auth0";

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
```

### Step 4: Update Root Layout

Update `avikonai/src/app/layout.tsx`:
```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/hooks/use-theme";
import { ToastProvider } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import { ToastContainer } from "@/components/ui/toast";
import { UserProvider } from '@auth0/nextjs-auth0/client';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AvikonAI - AI PFP Generator",
  description: "Create stunning AI-generated profile pictures with advanced customization options",
  keywords: ["AI", "profile picture", "avatar", "generator", "artificial intelligence"],
  authors: [{ name: "AvikonAI Team" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-gray-900 transition-colors`}
      >
        <UserProvider>
          <ThemeProvider>
            <ToastProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
              </div>
              <ToastContainer />
            </ToastProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
```

## Component Development

### Step 5: Create Authentication Components

Create `avikonai/src/components/auth/LoginButton.tsx`:
```typescript
'use client';

import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface LoginButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function LoginButton({ className, children }: LoginButtonProps) {
  return (
    <Button asChild className={className}>
      <a href="/auth/login">
        <LogIn className="w-4 h-4 mr-2" />
        {children || 'Sign In'}
      </a>
    </Button>
  );
}
```

Create `avikonai/src/components/auth/LogoutButton.tsx`:
```typescript
'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
  return (
    <Button variant="ghost" asChild className={className}>
      <a href="/auth/logout">
        <LogOut className="w-4 h-4 mr-2" />
        {children || 'Sign Out'}
      </a>
    </Button>
  );
}
```

Create `avikonai/src/components/auth/SignupButton.tsx`:
```typescript
'use client';

import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface SignupButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function SignupButton({ className, children }: SignupButtonProps) {
  return (
    <Button asChild className={className}>
      <a href="/auth/login?screen_hint=signup">
        <UserPlus className="w-4 h-4 mr-2" />
        {children || 'Sign Up'}
      </a>
    </Button>
  );
}
```

Create `avikonai/src/components/auth/UserProfile.tsx`:
```typescript
'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from '@/components/ui/button';
import { User, Settings } from 'lucide-react';
import Link from 'next/link';

export function UserProfile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
      <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
    </div>
  );

  if (error) return <div>Error: {error.message}</div>;

  if (!user) return null;

  return (
    <div className="flex items-center space-x-3">
      <img
        src={user.picture || '/default-avatar.png'}
        alt={user.name || 'User'}
        className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700"
      />
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {user.name}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {user.email}
        </p>
      </div>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/profile">
          <Settings className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}
```

### Step 6: Update Header Component

Update `avikonai/src/components/layout/header.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Menu, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoginButton } from '@/components/auth/LoginButton';
import { SignupButton } from '@/components/auth/SignupButton';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { UserProfile } from '@/components/auth/UserProfile';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only use theme after component is mounted
  let theme = 'light';
  let toggleTheme = () => {};

  try {
    const themeHook = useTheme();
    theme = themeHook.theme;
    toggleTheme = themeHook.toggleTheme;
  } catch {
    // Theme provider not available during SSR
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Generate', href: '/generate' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Pricing', href: '/pricing' },
  ];

  // Add authenticated routes
  if (user) {
    navigation.push({ name: 'Generated Photos', href: '/generated-photos' });
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              AvikonAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-9 h-9 p-0"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </Button>
            )}

            {/* Auth Section */}
            <div className="hidden sm:flex items-center space-x-3">
              {!isLoading && (
                user ? (
                  <>
                    <UserProfile />
                    <LogoutButton />
                  </>
                ) : (
                  <>
                    <LoginButton />
                    <SignupButton />
                  </>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-9 h-9 p-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            mobileMenuOpen
              ? 'max-h-96 opacity-100 pb-4'
              : 'max-h-0 opacity-0'
          )}
        >
          <nav className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-2 py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            <div className="pt-2 space-y-2">
              {!isLoading && (
                user ? (
                  <>
                    <div className="px-2 py-2">
                      <UserProfile />
                    </div>
                    <LogoutButton className="w-full" />
                  </>
                ) : (
                  <>
                    <LoginButton className="w-full" />
                    <SignupButton className="w-full" />
                  </>
                )
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
```

## Route Protection

### Step 7: Create Protected Routes

Create `avikonai/src/app/generated-photos/page.tsx`:
```typescript
import { auth0 } from '@/lib/auth0';

export default auth0.withPageAuthRequired(
  async function GeneratedPhotos() {
    const { user } = await auth0.getSession();

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Generated Photos
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Welcome back, {user?.name}! Here are your AI-generated images.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No photos generated yet
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start creating amazing AI images!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
  { returnTo: '/generated-photos' }
);
```

Create `avikonai/src/app/profile/page.tsx`:
```typescript
import { auth0 } from '@/lib/auth0';
import { Card } from '@/components/ui/card';

export default auth0.withPageAuthRequired(
  async function Profile() {
    const { user } = await auth0.getSession();

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Profile Settings
          </h1>

          <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={user?.picture || '/default-avatar.png'}
                alt={user?.name || 'User'}
                className="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-gray-600"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user?.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Account Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      User ID
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                      {user?.sub}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Updated
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.updated_at ? new Date(user.updated_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Verified
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.email_verified ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  },
  { returnTo: '/profile' }
);
```

### Step 8: Create Utils for Auth State

Create `avikonai/src/lib/utils.ts` (or add to existing):
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Auth utility functions
export function isAuthenticated(user: any): boolean {
  return !!user;
}

export function requireAuth(user: any): void {
  if (!user) {
    throw new Error('Authentication required');
  }
}
```

## Vercel Deployment

### Step 9: Configure Vercel Environment Variables

1. **In Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add all Auth0 environment variables for Production

2. **Update Auth0 Application Settings:**
   - Add Vercel production URL to Allowed Callback URLs
   - Add Vercel production URL to Allowed Logout URLs
   - Add Vercel production URL to Allowed Web Origins

### Step 10: Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Auth0 application configured with production URLs
- [ ] Middleware configured correctly
- [ ] All authentication routes work
- [ ] Protected routes redirect properly
- [ ] User profile displays correctly
- [ ] Sign in/out functionality works
- [ ] Mobile responsive design maintained

## Testing

### Step 11: Test Authentication Flow

1. **Local Testing:**
   ```bash
   npm run dev
   ```

2. **Test Cases:**
   - [ ] Visit home page (public access)
   - [ ] Click "Sign In" → Auth0 Universal Login
   - [ ] Complete authentication
   - [ ] Verify user profile in header
   - [ ] Access protected route `/generated-photos`
   - [ ] Visit `/profile` page
   - [ ] Test logout functionality
   - [ ] Verify redirect after login
   - [ ] Test mobile navigation
   - [ ] Verify theme toggle works with auth

3. **Production Testing:**
   - [ ] Deploy to Vercel
   - [ ] Test authentication flow on production
   - [ ] Verify all environment variables work
   - [ ] Test callback URLs
   - [ ] Test logout redirects

### Step 12: Error Handling

Add error boundary for auth errors in components:

Create `avikonai/src/components/auth/AuthError.tsx`:
```typescript
'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface AuthErrorProps {
  error?: string;
  onRetry?: () => void;
}

export function AuthError({ error, onRetry }: AuthErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Authentication Error
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          {error || 'Something went wrong with authentication. Please try again.'}
        </p>
        {onRetry && (
          <Button onClick={onRetry} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
```

## Final Implementation Notes

### TypeScript Types

Add Auth0 types to your project by creating `avikonai/src/types/auth.ts`:
```typescript
export interface UserProfile {
  sub?: string;
  name?: string;
  email?: string;
  email_verified?: boolean;
  picture?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface AuthError {
  message: string;
  cause?: string;
  status?: number;
}
```

### Loading States

Ensure all auth-dependent components handle loading states properly to prevent hydration mismatches and improve user experience.

### Security Considerations

- Keep `AUTH0_CLIENT_SECRET` secure and never expose it client-side
- Use strong, unique `AUTH0_SECRET` for production
- Regularly rotate secrets
- Monitor Auth0 logs for suspicious activity
- Enable MFA for Auth0 dashboard access

### Performance Optimization

- The Auth0 SDK automatically handles token refresh
- Session data is cached appropriately
- Middleware runs on Edge Runtime for better performance
- User data is fetched only when needed

This implementation provides a complete, production-ready Auth0 integration that maintains the existing AvikonAI design patterns while adding robust authentication functionality.