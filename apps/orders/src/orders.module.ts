import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// App
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

// Libs
import { HealthModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('POSTGRES_HOST', 'localhost'),
                port: configService.get<number>('POSTGRES_PORT', 5432),
                username: configService.get<string>('POSTGRES_USER', 'postgres'),
                password: configService.get<string>('POSTGRES_PASSWORD', 'postgres'),
                database: configService.get<string>('POSTGRES_DB', 'orders'),
                entities: [],
                synchronize: configService.get<string>('NODE_ENV', 'development') === 'development',
            }),
            inject: [ConfigService],
        }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
