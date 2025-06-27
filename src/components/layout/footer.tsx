import Link from 'next/link';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function AppFooter() {
  return (
    <footer className="border-t border-border/40 bg-card text-card-foreground">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-headline text-lg font-semibold">Innerspell AI</h3>
            <p className="text-sm text-muted-foreground mt-2">
              AI와 함께 당신의 내면을 탐험하고, 최고의 영적 길잡이를 만나보세요.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">바로가기</h4>
            <ul className="space-y-2 mt-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">상담사 찾기</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">콘텐츠</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">커뮤니티</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm">뉴스레터 구독</h4>
            <p className="text-xs text-muted-foreground mt-2">최신 소식과 특별한 혜택을 받아보세요.</p>
            <form className="flex gap-2 mt-3">
              <Input type="email" placeholder="이메일 주소" className="text-sm" />
              <Button type="submit" size="sm">구독</Button>
            </form>
          </div>
        </div>
        <div className="border-t border-border/40 mt-8 pt-6 text-center">
          <div className="flex justify-center gap-4 mb-4">
             <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">이용약관</Link>
             <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">개인정보처리방침</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Innerspellhub. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

    