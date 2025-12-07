import { useState } from 'react';
import { LogOut, MapPin, RefreshCw, User } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useNavigate } from 'react-router';

interface HeaderProps {
  city: string;
  state: string;
  fetchWeatherLogs: () => Promise<void>;
}

export const Header = ({ city, state, fetchWeatherLogs }: HeaderProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { logout } = useAuth() as { logout: () => void };
  const navigate = useNavigate();
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      (setIsRefreshing(false), fetchWeatherLogs());
    }, 2000);
  };
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <MapPin className="text-primary" size={24} />
          <h1 className="text-lg font-bold">
            {city}, {state}
          </h1>
           <button
            onClick={handleRefresh}
            className={`p-2 hover:bg-slate-800 rounded-lg transition-all ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} />
          </button>
        </div>

        <div className="flex gap-3.5 items-center ">
          <button onClick={handleProfile}>
            <User size={20} />
          </button>
          
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-slate-800 rounded-lg"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
