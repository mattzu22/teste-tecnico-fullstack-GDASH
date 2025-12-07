import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { Weather } from './schemas/weather.schema';
import { LoggerService } from 'src/common/services/logger.service';
import { WeatherRepository } from './weather.repository';

@Injectable()
export class WeatherService {
  constructor(
    private readonly weatherRepository: WeatherRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(weather: CreateWeatherDto): Promise<{ message: string }> {
    try {
      await this.weatherRepository.create(weather);

      this.logger.log(`Created weather log`);

      return { message: 'Registro de clima criado com sucesso' };
    } catch (error) {
      const err = error as Error;

      this.logger.error(`Failed to create weather log: ${err.message}`, {
        stack: err.stack,
      });

      throw new InternalServerErrorException(
        'Falha ao criar registro de clima.',
        err.message,
      );
    }
  }

  async findAll(): Promise<Weather[]> {
    try {
      const response = await this.weatherRepository.findAll();

      if (!response || response.length === 0) {
        throw new NotFoundException('Nenhum registro de clima encontrado.');
      }

      this.logger.log(`Searched ${response.length} weather logs.`);

      return response;
    } catch (error) {
      const err = error as Error;

      this.logger.error(`Failed to retrieve weather logs: ${err.message}`, {
        stack: err.stack,
      });

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Falha ao pesquisar registros de clima.',
      );
    }
  }

  async exportToCsv(): Promise<Weather[]> {
    try {
      const weatherLogs = await this.weatherRepository.findAndSort({
        timeStamp: -1,
      });

      this.logger.log(`Exporting ${weatherLogs.length} weather logs to CSV.`);

      return weatherLogs;
    } catch (error) {
      const err = error as Error;

      this.logger.error('Failed to export weather logs to CSV.', {
        stack: err.stack,
      });

      throw new InternalServerErrorException(
        'Falha ao exportar registros de clima para CSV.',
      );
    }
  }

  async exportXlsx(): Promise<Weather[]> {
    try {
      const weatherLogs = await this.weatherRepository.findAndSort({
        timeStamp: -1,
      });

      this.logger.log(`Exporting ${weatherLogs.length} weather logs to Xlsx.`);

      return weatherLogs;
    } catch (error) {
      const err = error as Error;

      this.logger.error('Failed to export weather logs to Xlsx.', {
        stack: err.stack,
      });

      throw new InternalServerErrorException(
        'Falha ao exportar registros de clima para Xlsx.',
      );
    }
  }
}
