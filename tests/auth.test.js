const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

beforeAll(async () => {
  jest.setTimeout(10000);
  // Use in-memory or test DB URI if provided
  const uri = process.env.MONGODB_URI_TEST || process.env.MONGODB_URI || 'mongodb://localhost:27017/resume_analyzer_test';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Auth routes', () => {
  test('Register and login flow', async () => {
    const email = 'testuser@example.com';
    const password = 'Password123!';
    const name = 'Test User';

    const reg = await request(app).post('/api/auth/register').send({ name, email, password });
    expect(reg.statusCode).toBe(200);
    expect(reg.body).toHaveProperty('token');

    const login = await request(app).post('/api/auth/login').send({ email, password });
    expect(login.statusCode).toBe(200);
    expect(login.body).toHaveProperty('token');
  });
});
