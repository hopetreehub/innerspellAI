import Link from 'next/link';

export function AppFooter() {
  return (
    <footer className="border-t border-border/40 py-6 md:px-8 md:py-0 bg-card">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          이너스펠허브와 함께 내면의 길잡이를 찾아보세요.
        </p>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} Innerspellhub</span>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">이용약관</Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">개인정보처리방침</Link>
        </div>
      </div>
    </footer>
  );
}
