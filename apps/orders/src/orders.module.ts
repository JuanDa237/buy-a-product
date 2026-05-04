import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// App
import { OrdersController } from './orders/controllers/orders.controller';
import { OrdersService } from './orders/services/orders.service';
import { Order } from './orders/entities/order.entity';
import { OrdersRepository } from './orders/repositories/orders.repository';

// Libs
import {
  ThrottlerModule,
  HealthModule,
  SqlDatabaseModule,
  LoggerModule,
  AuthModule,
} from '@app/common';
import { AuditTCPModule } from '@app/audit-common';

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SqlDatabaseModule,
    SqlDatabaseModule.forFeature([Order]),
    AuditTCPModule,
    ThrottlerModule,
    LoggerModule,
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
