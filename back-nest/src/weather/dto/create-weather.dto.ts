import { IsString, IsNumber, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

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
}
