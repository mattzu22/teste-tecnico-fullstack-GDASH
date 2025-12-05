/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';

import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { Weather } from './schemas/weather.schema';

import { type Response } from 'express';
import { Parser } from 'json2csv';
import * as XLSX from 'xlsx';

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';

interface WeatherDocument extends Weather {
  _id: any;
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
@ApiTags('Clima')
@Controller('api/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post('/logs')
  @ApiOperation({
    summary: 'Cria um novo registro de clima',
    description:
      'Endpoint para receber e salvar novos dados de telemetria climática.',
  })
  @ApiBody({
    type: CreateWeatherDto,
    description: 'Dados de telemetria climática a serem registrados.',
  })
  @ApiResponse({
    status: 201,
    description: 'Registro de clima criado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Requisição inválida (Bad Request).',
  })
  async create(
    @Body() weather: CreateWeatherDto,
  ): Promise<{ message: string }> {
    return await this.weatherService.create(weather);
  }

  @UseGuards(AuthTokenGuard)
  @Get('/logs')
  @ApiOperation({
    summary: 'Obtém todos os registros de clima',
    description:
      'Retorna uma lista de todos os registros de dados climáticos armazenados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos os registros climáticos.',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { $ref: '#/components/schemas/Weather' },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhum registro de clima encontrado.',
  })
  @ApiResponse({
    status: 500,
    description: 'Falha ao buscar os registros de clima.',
  })
  async findAll(): Promise<Weather[]> {
    return await this.weatherService.findAll();
  }

  @UseGuards(AuthTokenGuard)
  @Get('/export/csv')
  @ApiOperation({
    summary: 'Exporta os registros de clima para CSV',
    description: 'Gera e retorna um arquivo CSV com todos os dados climáticos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Arquivo CSV gerado com sucesso.',
    content: {
      'text/csv': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhum registro de clima para exportar.',
  })
  @ApiResponse({
    status: 500,
    description: 'Falha ao exportar os dados para CSV.',
  })
  async exportCsv(
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile | undefined> {
    const data = await this.weatherService.exportToCsv();

    if (!data || data.length === 0) {
      res.status(404).send('Nenhum registro de clima encontrado.');
      return;
    }

    const fields = [
      { label: 'City', value: 'city' },
      { label: 'State', value: 'state' },
      { label: 'Country', value: 'country' },
      { label: 'Timestamp', value: 'timestamp' },
      { label: 'Temperature (°C)', value: 'temperature_celsius' },
      { label: 'Humidity (%)', value: 'humidity_percent' },
      { label: 'Wind Speed (m/s)', value: 'wind_speed_ms' },
      { label: 'Wind Direction (°)', value: 'wind_direction_degrees' },
      { label: 'Weather Code', value: 'weather_code' },
      {
        label: 'Precipitation Probability (%)',
        value: 'precipitation_probability_percent',
      },
      { label: 'Previsão Horária (JSON)', value: 'hourly_forecast' },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csv;
    const buffer = Buffer.from(csvWithBOM, 'utf-8');

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `weather-logs-${timestamp}.csv`;

    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length.toString(),
    });

    return new StreamableFile(buffer);
  }

  @UseGuards(AuthTokenGuard)
  @Get('/export/xlsx')
  @ApiOperation({
    summary: 'Exporta os registros de clima para XLSX',
    description:
      'Gera e retorna um arquivo XLSX (Excel) com todos os dados climáticos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Arquivo XLSX gerado com sucesso.',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhum registro de clima para exportar.',
  })
  @ApiResponse({
    status: 500,
    description: 'Falha ao exportar os dados para XLSX.',
  })
  async exportXlsx(
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile | undefined> {
    const data = await this.weatherService.exportXlsx();

    if (!data || data.length === 0) {
      res.status(404).send('Nenhum registro de clima encontrado.');
      return;
    }

    const cleanData = data.map(
      ({ _id, __v, createdAt, updatedAt, ...rest }: WeatherDocument) => rest,
    );

    const sheet = XLSX.utils.json_to_sheet(cleanData);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'WeatherLogs');

    const xlsxBuffer = XLSX.write(book, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `weather-logs-${timestamp}.csv`;

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': xlsxBuffer.length.toString(),
    });

    return new StreamableFile(xlsxBuffer);
  }
}
