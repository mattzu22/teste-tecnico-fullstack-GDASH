import { getInsights } from '@/service/insightsAI';
import { AirVent, ArrowBigLeft, ArrowBigRight, CloudUpload, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export interface GetInsightsProps {
  title?: string;
  description?: string;
  status?: number;
  message?: string;
}

export const InsightAI = () => {
  const [insights, setInsights] = useState<{
    title?: string;
    description?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  async function getinsights() {
    try {
      setLoading(true);
      const { title, description, message, status }: GetInsightsProps =
        await getInsights();

      if (status === 500) {
        toast.error(message);
      }

      setInsights({ title, description });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <AirVent className="text-amber-500 shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-lg mb-1">
              {insights?.title || 'Insight AI'}
            </h3>
            <p className="text-slate-300 text-sm pr-4">{insights?.description}</p>
          </div>
        </div>
        <button
          onClick={getinsights}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm whitespace-nowrap transition-colors shrink-0"
        >
          {loading ? 
          <Loader2 className="animate-spin" /> 
          : 
          <div className='flex items-center justify-center gap-2'>
            <p>Insights</p>
            <CloudUpload size={16} />
          </div>}
        </button>
      </div>
    </div>
  );
};
