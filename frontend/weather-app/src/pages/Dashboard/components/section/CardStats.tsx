import { type WeatherData } from '@/interfaces/Weather';
interface CardStatsProps {
  title: string;
  description: string;
}
const CardsStats = ({ title, description }: CardStatsProps) => {
  return (
    <div className="flex-1 min-w-[158px] bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
      <p className="text-slate-400 text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold">{description}</p>
    </div>
  );
};

const ContainerCardsStats = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-wrap gap-4">{children}</div>;
};

interface StatsSectionProps {
  logWeather: WeatherData;
}
export const StatsSection = ({ logWeather }: StatsSectionProps) => {
  const statsCard = [
    {
      title: 'Humidity',
      description: logWeather.humidity_percent + '%',
    },
    {
      title: 'Wind Speed',
      description: logWeather.wind_speed_ms + 'm/s',
    },
    {
      title: 'Wind Direction',
      description: logWeather.wind_direction_degrees + '°',
    },
  ];

  return (
    <ContainerCardsStats>
      {statsCard.map((stat, index) => (
        <CardsStats
          key={index}
          title={stat.title}
          description={stat.description}
        />
      ))}
    </ContainerCardsStats>
  );
};
