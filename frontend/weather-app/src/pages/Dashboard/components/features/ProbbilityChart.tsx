import type { WeatherData } from '@/interfaces/Weather';
import { calculateProbabilityVariation } from '@/utils/chart';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export const ProbbilityChart = ({ logWeather, logsWeathers }: any) => {
  const probabilityVariation = calculateProbabilityVariation(logsWeathers);

  const chartRainData: [{ time: string; probability: number }] = logsWeathers
    .slice(-10)
    .map((log: WeatherData) => ({
      time: new Date(log.timestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
      }),
      probability: log.precipitation_probability_percent,
    }));

  return (
    <div className="flex-1 min-w-[288px] bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
      <div className="mb-4">
        <p className="text-slate-400 text-sm mb-2">
          Previsão de Probabilidade de Chuva
        </p>
        <p className="text-4xl font-bold mb-1">
          {logWeather.precipitation_probability_percent}%
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">Próximas 24 horas</span>
          <span className={`${probabilityVariation.color} font-semibold`}>
            {probabilityVariation.value}
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartRainData}>
          <XAxis
            dataKey="time"
            stroke="var(--color-slate-500)"
            tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-slate-800)',
              border: '1px solid var(--color-slate-700)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'var(--color-slate-400)' }}
          />
          <Bar
            dataKey="probability"
            fill="var(--color-blue-500)"
            opacity={0.3}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
