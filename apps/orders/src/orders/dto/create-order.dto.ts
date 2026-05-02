import { IsString, IsInt, Min, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  productId!: string;

  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1 (insufficient stock)' })
  quantity!: number;

  @IsString()
  userId!: string;

  @IsNumber()
  @IsPositive()
  totalAmount!: number;
}
