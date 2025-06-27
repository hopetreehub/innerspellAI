'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Phone, Wallet } from 'lucide-react';
import type { Consultant } from '@/types/consultant';
import { cn } from '@/lib/utils';

export function ConsultantCard({ consultant }: { consultant: Consultant }) {
  const handleCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `tel:060-700-1234,${consultant.phoneId}`;
  };

  return (
    <Link href={`/consultant/${consultant.id}`} className="block group">
      <Card className="w-full overflow-hidden transition-all group-hover:shadow-primary/20 group-hover:shadow-lg group-hover:-translate-y-1 flex h-full">
        <div className="relative w-1/3 aspect-[4/5]">
          <Image
            src={consultant.image}
            alt={consultant.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 16vw, 12vw"
            data-ai-hint={consultant.dataAiHint}
          />
           <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full border border-white/30">
            <span className={cn(
              "w-2 h-2 rounded-full",
              consultant.status === 'available' ? 'bg-green-500' : 'bg-red-500'
            )}></span>
            <span>{consultant.status === 'available' ? '상담가능' : '상담중'}</span>
          </div>
        </div>
        <div className="p-3 flex flex-col justify-between flex-1 w-2/3">
          <div>
             <h3 className="font-headline text-lg font-semibold leading-tight">
              {consultant.name}
              <span className="text-base text-muted-foreground ml-1 font-normal">[{consultant.phoneId}]</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{consultant.specialty}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 fill-secondary text-secondary" />
              <span className="font-semibold text-xs">{consultant.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({consultant.reviewCount})</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {consultant.keywords.slice(0, 2).map(keyword => (
                <Badge key={keyword} variant="outline" className="text-xs font-normal px-1.5 py-0.5">{keyword}</Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2 mt-2">
             <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Wallet className="w-3 h-3"/>
                <span>30초당 {consultant.price.toLocaleString()}원</span>
             </div>
            <Button className="w-full h-8 text-sm" size="sm" onClick={handleCallClick}>
              <Phone className="mr-1.5 h-3.5 w-3.5" /> 전화상담
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
