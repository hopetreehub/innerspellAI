'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { getDailySpell } from '@/ai/flows/daily-spell-flow';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DailySpellCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [spell, setSpell] = useState({ title: '오늘의 스펠카드', description: '오늘의 메시지를 보려면 카드를 뒤집어주세요.' });

  useEffect(() => {
    async function fetchSpell() {
      setIsLoading(true);
      try {
        const result = await getDailySpell();
        setSpell(result);
      } catch (error) {
        console.error("Failed to fetch daily spell:", error);
        setSpell({ title: '오류', description: '메시지를 불러오는 데 실패했습니다. 다시 시도해주세요.' });
      } finally {
        setIsLoading(false);
      }
    }
    fetchSpell();
  }, []);

  return (
    <div className="w-full aspect-[16/9] [perspective:1000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <div
        className={cn('relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]', { '[transform:rotateY(180deg)]': isFlipped })}
      >
        {/* Card Front */}
        <div className="absolute w-full h-full [backface-visibility:hidden] overflow-hidden rounded-xl shadow-lg">
          <Image src="https://placehold.co/800x450.png" alt="신비로운 배경" fill className="object-cover" data-ai-hint="mystical nebula" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-black/70 flex flex-col justify-center items-center text-center p-8 text-white">
            <h3 className="font-headline text-3xl md:text-4xl font-bold">오늘의 스펠카드</h3>
            <p className="mt-2 text-white/80">카드를 클릭하여 오늘의 메시지를 확인하세요.</p>
          </div>
        </div>

        {/* Card Back */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden rounded-xl shadow-lg">
           <Image src="https://placehold.co/800x450.png" alt="천상의 별 배경" fill className="object-cover" data-ai-hint="celestial star" />
           <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center p-8 text-white backdrop-blur-sm">
            {isLoading ? (
              <div className="space-y-3 max-w-md w-full">
                <Skeleton className="h-8 w-2/3 mx-auto" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mx-auto" />
              </div>
            ) : (
              <>
                <h3 className="font-headline text-3xl md:text-4xl font-bold">{spell.title}</h3>
                <p className="mt-4 text-lg text-white/90 max-w-md">{spell.description}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
