'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" opacity="0.5"></path>
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z"></path>
              <path d="M12 12a1 1 0 1 0-1-1 1 1 0 0 0 1 1z"></path>
            </svg>
            <span className="font-bold font-headline text-lg">Innerspellhub</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">상담사</Link>
            <Link href="/content" className="transition-colors hover:text-foreground/80 text-foreground/60">콘텐츠</Link>
            <Link href="/community" className="transition-colors hover:text-foreground/80 text-foreground/60">커뮤니티</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <Button asChild variant="outline">
            <Link href="/login">로그인</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
