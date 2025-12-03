import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Weather, WeatherSchema } from './schemas/weather.schema';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { LoggerService } from 'src/common/services/logger.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Weather.name, schema: WeatherSchema }]),
    AuthModule,
    UserModule,
  ],
  controllers: [WeatherController],
  providers: [WeatherService, LoggerService],
})
export class WeatherModule {}
