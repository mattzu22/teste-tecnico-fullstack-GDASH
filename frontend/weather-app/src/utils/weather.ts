import {
  Sun,
  CloudSun,
  Cloudy,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudHail,
  CloudLightning,
  Snowflake,
  HelpCircle,
} from 'lucide-react';

export const getWeatherInfo = (weatherCode: number) => {
  switch (weatherCode) {
    // Céu claro
    case 0:
      return { condition: 'Céu Limpo', Icon: Sun, color: 'text-amber-400' };

    // Parcialmente nublado
    case 1:
      return {
        condition: 'Predominantemente Limpo',
        Icon: CloudSun,
        color: 'text-amber-400',
      };

    case 2:
      return {
        condition: 'Parcialmente Nublado',
        Icon: CloudSun,
        color: 'text-slate-400',
      };

    // Nublado
    case 3:
      return { condition: 'Nublado', Icon: Cloudy, color: 'text-slate-400' };

    // Nevoeiro
    case 45:
      return { condition: 'Nevoeiro', Icon: CloudFog, color: 'text-slate-500' };

    case 48:
      return {
        condition: 'Nevoeiro com Geada',
        Icon: CloudFog,
        color: 'text-slate-500',
      };

    // Garoa
    case 51:
      return {
        condition: 'Garoa Leve',
        Icon: CloudDrizzle,
        color: 'text-sky-400',
      };

    case 53:
      return {
        condition: 'Garoa Moderada',
        Icon: CloudDrizzle,
        color: 'text-sky-400',
      };

    case 55:
      return {
        condition: 'Garoa Intensa',
        Icon: CloudDrizzle,
        color: 'text-sky-400',
      };

    case 56:
      return {
        condition: 'Garoa Congelante Leve',
        Icon: CloudRainWind,
        color: 'text-sky-400',
      };

    case 57:
      return {
        condition: 'Garoa Congelante Intensa',
        Icon: CloudRainWind,
        color: 'text-sky-400',
      };

    // Chuva
    case 61:
      return {
        condition: 'Chuva Leve',
        Icon: CloudRain,
        color: 'text-sky-400',
      };

    case 63:
      return {
        condition: 'Chuva Moderada',
        Icon: CloudRain,
        color: 'text-sky-400',
      };

    case 65:
      return {
        condition: 'Chuva Intensa',
        Icon: CloudRain,
        color: 'text-sky-400',
      };

    case 66:
      return {
        condition: 'Chuva Congelante Leve',
        Icon: CloudRainWind,
        color: 'text-sky-400',
      };

    case 67:
      return {
        condition: 'Chuva Congelante Intensa',
        Icon: CloudRainWind,
        color: 'text-sky-400',
      };

    // Neve
    case 71:
      return { condition: 'Neve Leve', Icon: CloudSnow, color: 'text-white' };

    case 73:
      return {
        condition: 'Neve Moderada',
        Icon: CloudSnow,
        color: 'text-white',
      };

    case 75:
      return {
        condition: 'Neve Intensa',
        Icon: CloudSnow,
        color: 'text-white',
      };

    case 77:
      return {
        condition: 'Grãos de Neve',
        Icon: Snowflake,
        color: 'text-white',
      };

    // Pancadas de chuva
    case 80:
      return {
        condition: 'Pancadas de Chuva Leves',
        Icon: CloudRain,
        color: 'text-sky-400',
      };

    case 81:
      return {
        condition: 'Pancadas de Chuva Moderadas',
        Icon: CloudRain,
        color: 'text-sky-400',
      };

    case 82:
      return {
        condition: 'Pancadas de Chuva Fortes',
        Icon: CloudRain,
        color: 'text-sky-400',
      };

    // Pancadas de neve
    case 85:
      return {
        condition: 'Pancadas de Neve Leves',
        Icon: CloudSnow,
        color: 'text-white',
      };

    case 86:
      return {
        condition: 'Pancadas de Neve Intensas',
        Icon: CloudSnow,
        color: 'text-white',
      };

    // Trovoadas
    case 95:
      return {
        condition: 'Trovoada',
        Icon: CloudLightning,
        color: 'text-yellow-300',
      };

    case 96:
      return {
        condition: 'Trovoada com Granizo Leve',
        Icon: CloudHail,
        color: 'text-yellow-300',
      };

    case 99:
      return {
        condition: 'Trovoada com Granizo Intenso',
        Icon: CloudHail,
        color: 'text-yellow-300',
      };

    default:
      return {
        condition: 'Desconhecido',
        Icon: HelpCircle,
        color: 'text-slate-400',
      };
  }
};
