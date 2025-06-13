const request = require('supertest');
const { app } = require('../src/test');

describe('API routes', () => {
  test('GET /api/test returns status 200', async () => {
    const res = await request(app).get('/api/test');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'API is working!' });
  });
});
