import type { WeatherData } from '@/interfaces/Weather';

export const calculateTimeSpan = (logs: WeatherData[]): string => {
  const recentLogs = logs.slice(-10);
  if (recentLogs.length < 2) {
    return 'Dados insuficientes';
  }

  const firstLogTime = new Date(recentLogs[0].timestamp).getTime();
  const lastLogTime = new Date(
    recentLogs[recentLogs.length - 1].timestamp,
  ).getTime();

  const diffMinutes = Math.round((lastLogTime - firstLogTime) / (1000 * 60));

  if (diffMinutes < 60) {
    return `Últimos ${diffMinutes} minutos`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  return `Últimas ${diffHours} horas`;
};

export const calculateTemperatureVariation = (
  logs: WeatherData[],
): { value: string; color: string } => {
  const recentLogs = logs.slice(-10);
  if (recentLogs.length < 2) {
    return { value: 'N/D', color: 'text-slate-400' };
  }

  const startTemp = recentLogs[0].temperature_celsius;
  const endTemp = recentLogs[recentLogs.length - 1].temperature_celsius;

  const variation = endTemp - startTemp;

  const arrow = variation >= 0 ? '↑' : '↓';
  const value = `${arrow} ${Math.abs(variation).toFixed(1)}°C`;
  const color = variation >= 0 ? 'text-green-500' : 'text-red-500';

  return { value, color };
};

export const calculateProbabilityVariation = (
  logs: WeatherData[],
): { value: string; color: string } => {
  const recentLogs = logs.slice(-10);
  if (recentLogs.length < 2) {
    return { value: 'N/D', color: 'text-slate-400' };
  }

  const startProb = recentLogs[0].precipitation_probability_percent;
  const endProb =
    recentLogs[recentLogs.length - 1].precipitation_probability_percent;

  const variation = endProb - startProb;

  const value = `${variation > 0 ? '+' : ''}${variation.toFixed(0)}%`;
  const color = variation >= 0 ? 'text-green-500' : 'text-red-500';

  return { value, color };
};
