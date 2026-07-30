import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <h1 className="text-6xl font-black tracking-tight text-primary">404</h1>
        <h2 className="text-xl font-black uppercase tracking-tight">Page not found</h2>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <Button className="mt-2 font-black uppercase text-xs">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
