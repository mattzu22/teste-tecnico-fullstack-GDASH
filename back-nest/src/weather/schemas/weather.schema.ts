import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
  humidity_percent: number;

  @Prop({ required: true })
  wind_speed_ms: number;

  @Prop({ required: true })
  wind_direction_degrees: number;

  @Prop({ required: true })
  weather_code: number;

  @Prop({ required: true })
  precipitation_probability_percent: number;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
