import { ApiProperty } from '@nestjs/swagger';

export class KafkaMessageDto {
  @ApiProperty({ description: 'Hash of the card', example: 'abcd1234' })
  card_hash: string;

  @ApiProperty({ description: 'ID of the user', example: 1 })
  user_id: string;

  @ApiProperty({ description: 'ID of the order', example: '1' })
  order_id: string;

  @ApiProperty({ description: 'Unique transaction ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  transactionId: string;

  @ApiProperty({ description: 'email', example: 'a@test.com' })
  user_email: string;

  @ApiProperty({ description: 'Amount', example: 100 })
  amount: number;

  @ApiProperty({ description: 'Phone', example: '+71234567890' })
  user_phone: string;

  @ApiProperty({ description: 'Payment name', example: 'Activation card' })
  payment_name: string;

  
}