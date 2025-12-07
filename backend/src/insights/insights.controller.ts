/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Post } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { Throttle } from '@nestjs/throttler';
import { InsightResponseDto } from './dto/insight-response.dto'; // Import InsightResponseDto

@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Post()
  @Throttle({ default: { limit: 6, ttl: 9000 } })
  async Generate(): Promise<InsightResponseDto> {
    const insights = await this.insightsService.GenerateInsights();
    return insights;
  }
}
