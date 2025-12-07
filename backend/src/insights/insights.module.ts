import { Module } from '@nestjs/common';
import { LoggerService } from 'src/common/services/logger.service';
import { InsightsService } from './insights.service';
import { InsightsController } from './insights.controller';
import { WeatherModule } from 'src/weather/weather.module';
import { ConfigModule } from '@nestjs/config';
import { InsightsRepository } from './insights.repository';

@Module({
  imports: [WeatherModule, ConfigModule],
  controllers: [InsightsController],
  providers: [LoggerService, InsightsService, InsightsRepository],
  exports: [],
})
export class InsightsModule {}
