const TEST_DB = 'test_highscores.db';
process.env.DB_PATH = TEST_DB;

const request = require('supertest');
const app = require('../server');
const fs = require('fs');
const path = require('path');

describe('API Endpoints', () => {
  afterAll(() => {
    if (fs.existsSync(TEST_DB)) {
      fs.unlinkSync(TEST_DB);
    }
  });


  it('should return an empty array if no scores exist', async () => {
    const res = await request(app).get('/api/scores');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new score', async () => {
    const res = await request(app)
      .post('/api/scores')
      .send({
        name: 'TEST PLAYER',
        score: 1000,
        difficulty: 'medium'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('success', true);
  });

  it('should return scores ordered by score desc', async () => {
    await request(app).post('/api/scores').send({ name: 'PLAYER 1', score: 500, difficulty: 'low' });
    await request(app).post('/api/scores').send({ name: 'PLAYER 2', score: 1500, difficulty: 'high' });

    const res = await request(app).get('/api/scores');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeLessThanOrEqual(3);
    expect(res.body[0].name).toEqual('PLAYER 2');
    expect(res.body[0].score).toEqual(1500);
  });

  it('should return 400 if fields are missing', async () => {
    const res = await request(app)
      .post('/api/scores')
      .send({
        name: 'MISSING FIELDS'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });
});
