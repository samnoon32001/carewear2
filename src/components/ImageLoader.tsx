import { cn } from '@/lib/utils';

interface ImageLoaderProps {
  className?: string;
  aspect?: string;
}

export function ImageLoader({ className, aspect = "aspect-[3/4]" }: ImageLoaderProps) {
  return (
    <div className={cn("animate-pulse bg-muted rounded-lg", aspect, className)}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 bg-muted-foreground/10 rounded" />
      </div>
    </div>
  );
}
