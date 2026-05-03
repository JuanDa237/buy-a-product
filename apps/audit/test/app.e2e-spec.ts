import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HealthModule } from '@app/common';
import { Server } from 'http';
import { AuditController } from '../src/audit/controllers/audit.controller';
import { AuditService } from '../src/audit/services/audit.service';

interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

describe('AuditController (e2e)', () => {
  let app: INestApplication;
  let auditService: { getAuditLog: jest.Mock };

  beforeAll(async () => {
    auditService = {
      getAuditLog: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
      controllers: [AuditController],
      providers: [{ provide: AuditService, useValue: auditService }],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
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

  it('/audit/:orderId (GET) returns audit log for order', async () => {
    const orderId = '123';
    const expectedLog = [
      {
        orderId,
        fromStatus: 'PENDING',
        toStatus: 'CONFIRMED',
        metadata: { actor: 'system' },
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ];

    auditService.getAuditLog.mockResolvedValue(expectedLog);

    const response = await request(app.getHttpServer() as Server)
      .get(`/audit/${orderId}`)
      .expect(200);

    expect(response.body).toEqual(expectedLog);
    expect(auditService.getAuditLog).toHaveBeenCalledWith(orderId);
  });
});
