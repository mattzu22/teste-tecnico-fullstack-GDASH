import { Skeleton } from '@/components/ui/skeleton';

export const SkeletonDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4">
      {/* Skeleton do Header */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Skeleton do Card Principal */}
      <Skeleton className="h-48 w-full rounded-2xl mb-6" />

      {/* Skeleton dos Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>

      {/* Skeleton dos Gráficos */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Skeleton className="flex-1 min-w-[288px] h-80 rounded-xl" />
        <Skeleton className="flex-1 min-w-[288px] h-80 rounded-xl" />
      </div>

      {/* Skeleton do Histórico */}
      <div>
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
};
