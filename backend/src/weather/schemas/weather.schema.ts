import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class HourlyForecast extends Document {
  @Prop([String])
  times: string[];

  @Prop([Number])
  precipitation_probability: number[];

  @Prop([Number])
  precipitation: number[];
}
export const HourlyForecastSchema =
  SchemaFactory.createForClass(HourlyForecast);

@Schema({
  timestamps: true,
  collection: 'weathers',
})
export class Weather {
  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: true, trim: true })
  state: string;

  @Prop({ required: true, trim: true })
  country: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  temperature_celsius: number;

  @Prop({ required: true })
  apparent_temperature: number;

  @Prop({ required: true })
  humidity_percent: number;

  @Prop({ required: true })
  wind_speed_ms: number;

  @Prop({ required: true })
  wind_direction_degrees: number;

  @Prop({ required: true })
  weather_code: number;

  @Prop({ required: true })
  precipitation_probability_percent: number;

  @Prop({ type: HourlyForecastSchema })
  hourly_forecast: HourlyForecast;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
