import { NestFactory } from '@nestjs/core';
import { AuditModule } from './audit.module';

async function bootstrap() {
  const app = await NestFactory.create(AuditModule);
  await app.listen(process.env.AUDIT_PORT ?? 3000);
}

void bootstrap();
