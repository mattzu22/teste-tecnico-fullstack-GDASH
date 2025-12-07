import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LoggerService } from 'src/common/services/logger.service';
import { WeatherService } from 'src/weather/weather.service';
import { InsightsRepository } from './insights.repository';
import { Weather } from 'src/weather/schemas/weather.schema';
import { InsightResponseDto } from './dto/insight-response.dto';

@Injectable()
export class InsightsService {
  constructor(
    private readonly logger: LoggerService,
    private readonly weatherService: WeatherService,
    private readonly insightsRepository: InsightsRepository,
  ) {}
  async GenerateInsights(): Promise<InsightResponseDto> {
    try {
      const weatherData: Weather[] = await this.weatherService.findAll();

      this.logger.log(`Fetched ${weatherData.length} weather records.`);

      if (!weatherData || weatherData.length === 0) {
        throw new NotFoundException(
          'Nenhum registro de clima encontrado para gerar insights.',
        );
      }
      const latestWeatherData: Weather = weatherData[weatherData.length - 1];

      const insightJson =
        await this.insightsRepository.GenerateWeatherInsights(
          latestWeatherData,
        );

      return insightJson;
    } catch (error) {
      const err = error as Error;

      if (err instanceof NotFoundException) {
        this.logger.error(`Falaha ao gerar insights: ${err.message}`);
      } else {
        this.logger.error(
          `An unexpected error occurred during insight generation: ${err.message}`,
          {
            stack: err.stack,
          },
        );
      }

      throw new InternalServerErrorException(
        'Falha ao gerar insights. Tente novamente mais tarde.',
      );
    }
  }
}
