export interface HourlyForecast {
  times: string[];
  precipitation_probability: number[];
  precipitation: number[];
}

export interface WeatherData {
  _id: number;
  city: string;
  state: string;
  country: string;
  timestamp: Date;
  temperature_celsius: number;
  apparent_temperature: number;
  humidity_percent: number;
  wind_speed_ms: number;
  wind_direction_degrees: number;
  weather_code: number;
  precipitation_probability_percent: number;
  hourly_forecast: HourlyForecast; // New field
}
