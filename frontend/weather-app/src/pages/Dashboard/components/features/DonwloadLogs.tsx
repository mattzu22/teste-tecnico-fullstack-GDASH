import { useState, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import {
  downloadWeatherLogsCSV,
  downloadWeatherLogsXLSX,
} from '@/service/weatherService';

export const DonwloadLogs = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const downloadCSV = () => {
    downloadWeatherLogsCSV();

    setOpen(false);
  };

  const downloadXLSX = () => {
    downloadWeatherLogsXLSX();

    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-[0_8px_25px_-4px_rgba(0,0,0,0.35)] transition-all hover:scale-110 active:scale-95"
      >
        <Download size={22} />
      </button>

      {open && (
        <div
          className="
            absolute bottom-16 right-0 
            w-48 p-4 rounded-2xl 
            backdrop-blur-lg bg-[#0f1117]/80 
            border border-white/10 
            shadow-[0_8px_30px_rgba(0,0,0,0.3)]
            animate-fade-in-up
          "
        >
          <p className="text-xs text-gray-400 mb-3 font-medium">
            Formato do arquivo
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={downloadCSV}
              className="
                flex items-center gap-3 
                px-3 py-2 rounded-xl 
                hover:bg-white/10 transition-all
                group
              "
            >
              <span
                className="
                  w-9 h-9 rounded-xl bg-blue-600 
                  flex items-center justify-center 
                  text-xs font-bold text-white shadow 
                  group-hover:scale-105 transition
                "
              >
                CSV
              </span>
              <span className="text-sm text-gray-200">Baixar CSV</span>
            </button>

            <button
              onClick={downloadXLSX}
              className="
                flex items-center gap-3 
                px-3 py-2 rounded-xl 
                hover:bg-white/10 transition-all
                group
              "
            >
              <span
                className="
                  w-9 h-9 rounded-xl bg-blue-600 
                  flex items-center justify-center 
                  text-xs font-bold text-white shadow 
                  group-hover:scale-105 transition
                "
              >
                XLSX
              </span>
              <span className="text-sm text-gray-200">Baixar XLSX</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
