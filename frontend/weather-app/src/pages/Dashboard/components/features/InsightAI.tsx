import { ArrowRight, Flower2 } from 'lucide-react';

export const InsightAI = () => {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <Flower2 className="text-amber-500 shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-lg mb-1">
              AI Insight: High Pollen Count
            </h3>
            <p className="text-slate-300 text-sm">
              Allergy sufferers may experience symptoms today. Consider staying
              indoors.
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm whitespace-nowrap transition-colors shrink-0">
          Learn More
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
