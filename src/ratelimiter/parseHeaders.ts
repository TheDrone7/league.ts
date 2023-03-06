import type { RateLimitConfig } from './config';
import type { RawAxiosResponseHeaders, AxiosResponseHeaders } from 'axios';

/**
 * Parses the rate limit headers.
 * @param headers - The headers to parse.
 */
export function parseHeaders(headers: RawAxiosResponseHeaders | AxiosResponseHeaders): {
  app: RateLimitConfig[];
  method: RateLimitConfig[];
  usage: { app: number[]; method: number[] };
} {
  const usage = { app: [Date.now()], method: [Date.now()] };
  const app: RateLimitConfig[] = [];
  const method: RateLimitConfig[] = [];
  if (headers['x-app-rate-limit']) {
    const limits = headers['x-app-rate-limit'].split(',').map((limit: string) => limit.split(':'));
    for (const [limit, duration] of limits)
      app.push({ limit: parseInt(limit, 10), duration: parseInt(duration, 10) * 1000 });
  }
  if (headers['x-method-rate-limit']) {
    const limits = headers['x-method-rate-limit'].split(',').map((limit: string) => limit.split(':'));
    for (const [limit, duration] of limits)
      method.push({ limit: parseInt(limit, 10), duration: parseInt(duration, 10) * 1000 });
  }
  if (headers['x-app-rate-limit-count']) {
    usage.app = [];
    const counts = headers['x-app-rate-limit-count']
      .split(',')
      .map((count: string) => count.split(':'))
      .sort((a: string[], b: string[]) => parseInt(a[1], 10) - parseInt(b[1], 10));
    let prev = 0;
    for (const [count, duration] of counts) {
      const parsedDuration = parseInt(duration, 10) * 1000;
      usage.app.push(...Array.from({ length: parseInt(count, 10) }, () => Date.now() - prev));
      prev = parsedDuration + 1000;
    }
  }

  if (headers['x-method-rate-limit-count']) {
    usage.method = [];
    const counts = headers['x-method-rate-limit-count']
      .split(',')
      .map((count: string) => count.split(':'))
      .sort((a: string[], b: string[]) => parseInt(a[1], 10) - parseInt(b[1], 10));
    let prev = 0;
    for (const [count, duration] of counts) {
      const parsedDuration = parseInt(duration, 10) * 1000;
      usage.method.push(...Array.from({ length: parseInt(count, 10) }, () => Date.now() - prev));
      prev = parsedDuration + 1000;
    }
  }
  return { app, method, usage };
}
