import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { toast } from 'sonner';

import { Header } from './components/layout/Header';
import { InsightAI } from './components/features/InsightAI';
import { DonwloadLogs } from './components/features/DonwloadLogs';
import { StatsSection } from './components/section/CardStats';
import { HistoricalData } from './components/section/HistoricalData';
import { TemperatureChart } from './components/features/TemperatureChart';
import { ProbbilityChart } from './components/features/ProbbilityChart';
import { SkeletonDashboard } from './components/layout/SkeletonDashboard';

import { getWeatherInfo } from '@/utils/weather';
import { getWeatherLogs } from '@/service/weatherService';
import { type WeatherData } from '@/interfaces/Weather';

export const WeatherDashboard = () => {
  const [logWeather, setLogWeather] = useState<WeatherData>({
    _id: 0,
    city: '',
    state: '',
    country: '',
    timestamp: new Date(),
    temperature_celsius: 0,
    apparent_temperature: 0,
    humidity_percent: 0,
    wind_speed_ms: 0,
    wind_direction_degrees: 0,
    weather_code: 0,
    precipitation_probability_percent: 0,
    hourly_forecast: {
      times: [],
      precipitation_probability: [],
      precipitation: [],
    },
  });
  const [logsWeathers, setLogsWeathers] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const {
    condition: mainCondition,
    Icon: MainIcon,
    color: mainColor,
  } = getWeatherInfo(logWeather.weather_code);

  async function fetchWeatherLogs() {
    const oldLengthWeather = logsWeathers.length;
    setIsLoading(true);

    try {
      const { status, weatherLogs } = (await getWeatherLogs()) as {
        status: number;
        weatherLogs: WeatherData[];
      };
      const data = weatherLogs || [];

      if (status === 401) {
        navigate('/');
        return;
      }

      setLogsWeathers(data);

      if (data.length > 0) {
        const dataWeatherActual = data[data.length - 1];
        setLogWeather(dataWeatherActual);
      }

      if (oldLengthWeather > 0) {
        const newLengthWeather = data.length;
        if (newLengthWeather > oldLengthWeather) {
          toast.success('Dados climáticos atualizados!');
        } else {
          toast.info('Ainda não há atualizações sobre o tempo.');
        }
      }
    } catch (error) {
      toast.error('Falha ao buscar logs do clima.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchWeatherLogs();
  }, []);

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <Header
        city={logWeather.city}
        state={logWeather.state}
        fetchWeatherLogs={fetchWeatherLogs}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <div className="flex flex-col items-center text-center">
            {logWeather.weather_code !== undefined && (
              <MainIcon className={`${mainColor} mb-4`} size={80} />
            )}
            <h2 className="text-7xl font-bold mb-2">
              {logWeather.temperature_celsius}°C
            </h2>
            <p className="text-xl text-slate-300 mb-1">{mainCondition}</p>
            <p className="text-slate-400 text-base md:text-lg">
              Sensação térmica {logWeather.apparent_temperature}°C
            </p>
          </div>
        </div>

        <StatsSection logWeather={logWeather} />

        <InsightAI />

        <div className="flex flex-wrap gap-4">
          <TemperatureChart
            logsWeathers={logsWeathers}
            logWeather={logWeather}
          />

          <ProbbilityChart
            logWeather={logWeather}
            logsWeathers={logsWeathers}
          />
        </div>

        <HistoricalData logsWeathers={logsWeathers} />

        <div className="h-20"></div>
      </div>

      <DonwloadLogs />
    </div>
  );
};
