import type { WeatherData } from '@/interfaces/Weather';
import { getWeatherInfo } from '@/utils/weather';

export const HistoricalData = ({
  logsWeathers,
}: {
  logsWeathers: WeatherData[];
}) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-6 pb-4">
        <h3 className="text-xl font-bold">Dados Históricos</h3>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-96 custom-scroll">
        <table className="w-full">
          <thead className="bg-slate-800 text-slate-400 text-xs uppercase sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Data/Hora</th>
              <th className="px-6 py-3 text-left font-semibold">Condição</th>
              <th className="px-6 py-3 text-right font-semibold">Temp</th>
              <th className="px-6 py-3 text-right font-semibold">Umidade</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {logsWeathers.slice(-6).map((log, index) => {
              const { condition, Icon, color } = getWeatherInfo(
                log.weather_code,
              );

              return (
                <tr
                  key={log._id}
                  className={`border-b border-slate-700 ${index % 2 === 1 ? 'bg-slate-900/40' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleDateString('pt-BR', {
                      timeZone: 'UTC',
                    }) +
                      ', ' +
                      new Date(log.timestamp).toLocaleTimeString('pt-BR', {
                        timeZone: 'UTC',
                      })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Icon size={20} className={color} />
                      <span>{condition}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {log.temperature_celsius}°C
                  </td>
                  <td className="px-6 py-4 text-right">
                    {log.humidity_percent}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
