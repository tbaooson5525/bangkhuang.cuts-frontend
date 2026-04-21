import { Skeleton } from "../ui/skeleton";
interface StatCardProps {
  label: string;
  value: number;
  sub?: string;
  icon: React.ElementType;
  bgColor: string;
  loading?: boolean;
}

export function StatCard({
  label,
  value,
  loading,
  sub,
  bgColor,
  icon: Icon,
}: StatCardProps) {
  return (
    <div
      className='rounded-[20px] p-6 flex flex-col gap-3 min-w-0 cursor-default transition-all duration-200 hover:shadow-sm hover:-translate-y-px'
      style={{ background: bgColor }}
    >
      <div className='w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-black'>
        <Icon className='w-4 h-4' />
      </div>
      {/* Label */}
      <p className='text-[13px] text-black/50 dark:text-black font-medium'>
        {label}
      </p>
      {sub && (
        <p className='text-xs text-foreground/30 dark:text-black/80'>{sub}</p>
      )}

      {/* Value */}
      {loading ? (
        <Skeleton className='h-10 w-20 mb-1' />
      ) : (
        <p className='text-[40px] font-bold text-foreground dark:text-black leading-none'>
          {value}
        </p>
      )}
    </div>
  );
}
