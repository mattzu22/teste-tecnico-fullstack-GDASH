import { useState } from 'react';
import { MapPin, RefreshCw } from 'lucide-react';

export const Header = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <MapPin className="text-blue-400" size={24} />
          <h1 className="text-lg font-bold">New York, USA</h1>
        </div>
        <button
          onClick={handleRefresh}
          className={`p-2 hover:bg-slate-800 rounded-lg transition-all ${isRefreshing ? 'animate-spin' : ''}`}
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </header>
  );
};
