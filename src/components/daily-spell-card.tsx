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
          <Image src="https://placehold.co/800x450.png" alt="신비로운 배경" fill objectFit="cover" data-ai-hint="mystical nebula" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-black/70 flex flex-col justify-end items-center text-center p-8 text-white">
            <h3 className="font-headline text-3xl md:text-4xl font-bold">오늘의 스펠카드</h3>
            <p className="mt-2 text-white/80">오늘의 메시지를 보려면 클릭하세요.</p>
          </div>
        </div>

        {/* Card Back */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden rounded-xl shadow-lg">
           <Image src="https://placehold.co/800x450.png" alt="천상의 별 배경" fill objectFit="cover" data-ai-hint="celestial star" />
           <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-8 text-white backdrop-blur-sm">
            <h3 className="font-headline text-3xl md:text-4xl font-bold">별 카드</h3>
            <p className="mt-2 text-lg text-white/90 max-w-md">희망, 영감, 그리고 새로운 믿음이 당신을 찾아옵니다. 우주와 당신의 내면의 목소리를 믿으세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
