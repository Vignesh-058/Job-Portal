const request = require('supertest');
const app = require('../../server'); // Assuming server.js exports app
const mongoose = require('mongoose');

describe('Health & Server Initialization Checks', () => {
  it('should return 200 OK for the main /health route', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.uptime).toBeDefined();
  });

  it('should return 200 OK for the base / route', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Job Portal Enterprise API is running...');
  });

  it('should handle 404 for non-existent routes', async () => {
    const res = await request(app).get('/api/v1/this-route-does-not-exist');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toContain('Not Found');
  });
});
