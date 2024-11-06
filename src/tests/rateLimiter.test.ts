import request from 'supertest';
import { app } from '../index';

beforeEach(() => {
    // Reset rate limiter store
    if (app.get('limiter')) {
      app.get('limiter').resetKey('::ffff:127.0.0.1');
    }
  });

describe('Rate Limiter', () => {
  it('should allow requests within rate limit', async () => {
    const response = await request(app)
      .get('/health')
    
    expect(response.status).not.toBe(429); // 429 is Too Many Requests
  });

  it('should block requests that exceed rate limit', async () => {
    // Make multiple requests to trigger rate limit    
    for (let i = 0; i < 5; i++) {
      await request(app).get('/health');
    }

    // The last request should be rate limited
    const finalResponse = await request(app)
      .get('/health');
    
    expect(finalResponse.status).toBe(429);
    expect(finalResponse.body.message).toBe('Too many requests from this IP, please try again later.');
  });
});