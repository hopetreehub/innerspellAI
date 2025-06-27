
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import type { Consultant } from '@/types/consultant';


export function ConsultantCard({ consultant }: { consultant: Consultant }) {
  return (
    <Link href="#" className="block group">
      <Card className="w-full overflow-hidden transition-all group-hover:shadow-primary/20 group-hover:shadow-lg group-hover:-translate-y-1">
        <div className="relative aspect-[1/1]">
          <Image
            src={consultant.image}
            alt={consultant.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={consultant.dataAiHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3 text-white">
            <h3 className="font-headline text-lg font-semibold truncate">{consultant.name}</h3>
            <p className="text-sm text-white/80">{consultant.specialty}</p>
          </div>
          <Badge variant={consultant.status === 'available' ? "secondary" : "outline"} className={`absolute top-3 right-3 ${consultant.status === 'available' ? 'text-secondary-foreground' : 'bg-black/50 text-white backdrop-blur-sm border-white/50'}`}>
            {consultant.status === 'available' ? '상담 가능' : '상담 중'}
          </Badge>
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-secondary text-secondary" />
            <span className="font-semibold">{consultant.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({consultant.reviewCount} 리뷰)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {consultant.keywords.slice(0, 3).map(keyword => (
              <Badge key={keyword} variant="outline" className="text-xs font-normal">{keyword}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

    