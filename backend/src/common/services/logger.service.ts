import {
  Injectable,
  Logger,
  LoggerService as NestLoggerService,
} from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger = new Logger(LoggerService.name);

  log(message: string, context?: Record<string, any>): void {
    const messageFormatted = this.formatMessage(message, context);

    this.logger.log(messageFormatted);
  }

  error(message: string, context?: Record<string, any>): void {
    const messageFormatted = this.formatMessage(message, context);

    this.logger.error(messageFormatted);
  }

  warn(message: string, context?: Record<string, any>): void {
    const messageFormatted = this.formatMessage(message, context);

    this.logger.warn(messageFormatted);
  }

  private formatMessage(
    message: string,
    context?: Record<string, any>,
  ): string {
    if (!context) {
      return message;
    }

    return JSON.stringify({
      message,
      ...context,
      timestamp: new Date().toISOString(),
    });
  }
}
