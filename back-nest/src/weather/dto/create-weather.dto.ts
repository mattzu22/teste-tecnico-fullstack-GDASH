import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsDate,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class HourlyForecastDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  times: string[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty({ each: true })
  precipitation_probability: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty({ each: true })
  precipitation: number[];
}

export class CreateWeatherDto {
  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  timestamp: Date;

  @IsNotEmpty()
  @IsNumber()
  temperature_celsius: number;

  @IsNotEmpty()
  @IsNumber()
  apparent_temperature: number;

  @IsNotEmpty()
  @IsNumber()
  humidity_percent: number;

  @IsNotEmpty()
  @IsNumber()
  wind_speed_ms: number;

  @IsNotEmpty()
  @IsNumber()
  wind_direction_degrees: number;

  @IsNotEmpty()
  @IsNumber()
  weather_code: number;

  @IsNotEmpty()
  @IsNumber()
  precipitation_probability_percent: number;

  @ValidateNested()
  @Type(() => HourlyForecastDto)
  hourly_forecast: HourlyForecastDto;
}
