import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// App
import { OrdersController } from './orders/controllers/orders.controller';
import { OrdersService } from './orders/services/orders.service';
import { Order } from './orders/entities/order.entity';
import { OrdersRepository } from './orders/repositories/orders.repository';

// Libs
import { HealthModule } from '@app/common';
import { SqlDatabaseModule } from '@app/common/database';

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SqlDatabaseModule,
    SqlDatabaseModule.forFeature([Order]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
