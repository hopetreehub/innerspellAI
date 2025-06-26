import Link from 'next/link';

export function AppFooter() {
  return (
    <footer className="border-t border-border/40 py-6 md:px-8 md:py-0 bg-card">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Find your inner guidance with Innerspellhub.
        </p>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} Innerspellhub</span>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
