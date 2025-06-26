'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function DailySpellCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full aspect-[16/9] [perspective:1000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <div
        className={cn('relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]', { '[transform:rotateY(180deg)]': isFlipped })}
      >
        {/* Card Front */}
        <div className="absolute w-full h-full [backface-visibility:hidden] overflow-hidden rounded-xl shadow-lg">
          <Image src="https://placehold.co/800x450.png" alt="Mystical background" fill objectFit="cover" data-ai-hint="mystical nebula" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-black/70 flex flex-col justify-end items-center text-center p-8 text-white">
            <h3 className="font-headline text-3xl md:text-4xl font-bold">Today's Spell</h3>
            <p className="mt-2 text-white/80">Click to reveal your message for today.</p>
          </div>
        </div>

        {/* Card Back */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden rounded-xl shadow-lg">
           <Image src="https://placehold.co/800x450.png" alt="Celestial star background" fill objectFit="cover" data-ai-hint="celestial star" />
           <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-8 text-white backdrop-blur-sm">
            <h3 className="font-headline text-3xl md:text-4xl font-bold">The Star</h3>
            <p className="mt-2 text-lg text-white/90 max-w-md">Hope, inspiration, and renewed faith are on the horizon. Trust in the universe and your inner guidance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
