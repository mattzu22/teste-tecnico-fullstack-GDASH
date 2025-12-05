import { CloudRain } from 'lucide-react';

interface HeaderAuthProps {
  title: string;
  subtitle: string;
}
export const HeaderAuth = ({ title, subtitle }: HeaderAuthProps) => {
  return (
    <header className="sm:mx-auto sm:w-full sm:max-w-sm mb-8">
      <div className="flex justify-center">
        <CloudRain className="h-16 w-16 text-primary" strokeWidth={1.5} />
      </div>

      <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight  text-white">
        {title}
      </h2>
      <p className="mt-2 text-center text-sm text-slate-500">{subtitle}</p>
    </header>
  );
};
