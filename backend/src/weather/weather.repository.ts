import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather } from './schemas/weather.schema';
import { CreateWeatherDto } from './dto/create-weather.dto';

@Injectable()
export class WeatherRepository {
  constructor(
    @InjectModel(Weather.name)
    private readonly weatherModel: Model<Weather>,
  ) {}

  async create(createWeatherDto: CreateWeatherDto): Promise<Weather> {
    const createdWeather = await this.weatherModel.create(createWeatherDto);
    return createdWeather;
  }

  async findAll(): Promise<Weather[]> {
    const weatherData = await this.weatherModel.find().exec();
    return weatherData;
  }

  async findAndSort(sortOptions?: any): Promise<Weather[]> {
    const weatherData = await this.weatherModel
      .find()
      .sort(sortOptions)
      .lean()
      .exec();
    return weatherData;
  }
}
