import { Controller, Post, Body, Query } from '@nestjs/common';
import { BankRfService } from './bank-rf.service';
import { KafkaMessageDto } from 'src/dto/kafka-message.dto';

@Controller('bank-rf')
export class BankRfController {
  constructor(private readonly bankRfService: BankRfService) {}

  // Endpoint for initiating card processing
  @Post('process-card')
  async processCard(@Body() kafkaMessageDto: KafkaMessageDto) {
    try {
      await this.bankRfService.handleCardProcessing(kafkaMessageDto);
      return { success: true, message: 'Card processing initiated successfully' };
    } catch (error) {
      console.error('Error during card processing:', error);
      return { success: false, message: error.message };
    }
  }

  // Endpoint for initiating charge processing
  @Post('process-charge')
  async processCharge(@Body() kafkaMessageDto: KafkaMessageDto) {
    try {
      await this.bankRfService.handleChargeProcessing(kafkaMessageDto);
      return { success: true, message: 'Charge processing initiated successfully' };
    } catch (error) {
      console.error('Error during charge processing:', error);
      return { success: false, message: error.message };
    }
  }

  // Callback endpoint for 3DS method notification
  @Post('3ds-method-notification')
  async threeDSMethodNotification(@Body() body: any) {
    console.log('Received 3DS Method Notification:', body);
    return { success: true, message: 'Notification received' };
  }

  // Callback endpoint for 3DS callback
  @Post('3ds-callback')
  async threeDSCallback(@Body() body: any, @Query() query: any) {
    console.log('Received 3DS Callback:', { body, query });
    return { success: true, message: 'Callback received' };
  }
}
