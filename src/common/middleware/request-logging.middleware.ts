import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const startedAt = Date.now();

    response.on('finish', () => {
      const durationMs = Date.now() - startedAt;
      // Keep logging lightweight and non-intrusive.
      console.log(
        `${request.method} ${request.originalUrl} ${response.statusCode} ${durationMs}ms`,
      );
    });

    next();
  }
}
