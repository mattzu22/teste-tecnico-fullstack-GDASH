/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Weather } from 'src/weather/schemas/weather.schema';

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { InsightResponseDto } from './dto/insight-response.dto';

@Injectable()
export class InsightsRepository {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('API_GEMINI_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY não está configurado no arquivo .env');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });
  }

  async GenerateWeatherInsights(
    weatherData: Weather,
  ): Promise<InsightResponseDto> {
    const prompt = `
      Gere um insight climático no seguinte formato JSON, sem textos adicionais:
      
      Temperatura: ${weatherData.temperature_celsius}°C
      Umidade: ${weatherData.humidity_percent}%
      Direção do Vento: ${weatherData.wind_direction_degrees}
      Velocidade do Vento: ${weatherData.wind_speed_ms} km/h
      Condição: ${weatherData.weather_code}
      Probabiliade de chuva: ${weatherData.hourly_forecast.precipitation_probability[0]}%

      json:
      {
        "title": "AI Insight: [Título curto e direto]",
        "description": "[Descrição clara e objetiva do insight]"
      }

      exemplo:
      {
        "title": "AI Insight: Alta probabilidade de chuva",
        "description": "Prepare o guarda-chuva! A alta umidade e a alta probabilidade de chuva (83%) indicam que há grande chance de precipitação nas próximas horas. A temperatura amena (26.6°C) e a brisa leve (5.1 km/h) podem tornar o clima abafado antes da chuva.Melhor se precaver! Tudo indica que teremos chuva forte em breve. Uma boa pedida é relaxar em casa com um bom filme, aproveitando o clima aconchegante.."
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);

      let text = result.response.text().trim();

      text = text
        .replace(/```json\n?/gi, '')
        .replace(/```/g, '')
        .trim();

      let parsed = JSON.parse(text);

      if (Array.isArray(parsed)) {
        console.log('Resposta veio como array, pegando primeiro elemento');
        parsed = parsed[0];
      }

      if (!parsed.title || !parsed.description) {
        throw new Error('JSON sem campos obrigatórios');
      }

      return parsed;
    } catch (error) {
      console.error('Erro ao gerar insight:', error);
      throw new Error('Falha ao processar resposta da IA');
    }
  }
}
