import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import {
  calculateTemperatureVariation,
  calculateTimeSpan,
} from '@/utils/chart';
import type { WeatherData } from '@/interfaces/Weather';

interface TemperatureChartProps {
  logsWeathers: WeatherData[];
  logWeather: WeatherData;
}

export const TemperatureChart = ({
  logsWeathers,
  logWeather,
}: TemperatureChartProps) => {
  const timeSpan = calculateTimeSpan(logsWeathers);
  const temperatureVariation = calculateTemperatureVariation(logsWeathers);

  const chartTemperatureData = logsWeathers.slice(-10).map((log) => ({
    time: new Date(log.timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    }),
    temp: log.temperature_celsius,
  }));

  return (
    <div className="flex-1 min-w-[288px] bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
      <div className="mb-4">
        <p className="text-slate-400 text-sm mb-2">Histórico de Temperatura</p>
        <p className="text-4xl font-bold mb-1">
          {logWeather.temperature_celsius}°C
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">{timeSpan}</span>
          <span className={`${temperatureVariation.color} font-semibold`}>
            {temperatureVariation.value}
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartTemperatureData}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#tempGradient)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
