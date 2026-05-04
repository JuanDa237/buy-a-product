import { IsString, IsInt, Min, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'prod-uuid-123' })
  @IsString()
  productId!: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1 (insufficient stock)' })
  quantity!: number;

  @ApiProperty({ example: 'user-uuid-456' })
  @IsString()
  userId!: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @IsPositive()
  totalAmount!: number;
}
