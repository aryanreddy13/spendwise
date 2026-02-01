import { cn } from '@/lib/utils';

interface PlaceholderChartProps {
  type?: 'bar' | 'line';
  className?: string;
}

export const PlaceholderChart = ({ type = 'bar', className }: PlaceholderChartProps) => {
  if (type === 'line') {
    return (
      <div className={cn("h-32 flex items-end justify-center gap-1", className)}>
        <svg viewBox="0 0 200 80" className="w-full h-full">
          <polyline
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            points="10,60 40,40 70,50 100,30 130,35 160,20 190,25"
          />
          <circle cx="10" cy="60" r="3" fill="hsl(var(--primary))" />
          <circle cx="40" cy="40" r="3" fill="hsl(var(--primary))" />
          <circle cx="70" cy="50" r="3" fill="hsl(var(--primary))" />
          <circle cx="100" cy="30" r="3" fill="hsl(var(--primary))" />
          <circle cx="130" cy="35" r="3" fill="hsl(var(--primary))" />
          <circle cx="160" cy="20" r="3" fill="hsl(var(--primary))" />
          <circle cx="190" cy="25" r="3" fill="hsl(var(--primary))" />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("h-32 flex items-end justify-center gap-2", className)}>
      {[40, 65, 45, 80, 55, 70, 50].map((height, i) => (
        <div
          key={i}
          className="w-6 bg-primary/80 rounded-t transition-all hover:bg-primary"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
};
