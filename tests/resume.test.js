const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const path = require('path');

beforeAll(async () => {
  jest.setTimeout(20000);
  const uri = process.env.MONGODB_URI_TEST || process.env.MONGODB_URI || 'mongodb://localhost:27017/resume_analyzer_test';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Resume upload', () => {
  test('Upload requires auth', async () => {
    const res = await request(app)
      .post('/api/resumes/upload')
      .attach('resume', path.join(__dirname, 'fixtures', 'sample.pdf'));
    expect([401, 400]).toContain(res.statusCode);
  });
});
