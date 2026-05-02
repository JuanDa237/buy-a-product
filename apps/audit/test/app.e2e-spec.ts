import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AuditModule } from './../src/audit.module';
import { Server } from 'http';

interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

describe('AuditController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuditModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET) returns health payload', async () => {
    const response = await request(app.getHttpServer() as Server)
      .get('/')
      .expect(200);

    const body = response.body as HealthResponse;

    expect(body.status).toBe('ok');
    expect(body).toHaveProperty('service');
    expect(typeof body.service).toBe('string');
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
  });

  it('/hello (GET) returns hello world', async () => {
    await request(app.getHttpServer() as Server)
      .get('/hello')
      .expect(200)
      .expect('Hello World!');
  });
});
