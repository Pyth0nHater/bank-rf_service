import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BankRfModule } from './bank-rf/bank-rf.module';

@Module({
  imports: [BankRfModule], 
  controllers: [],
  providers: [], 
})
export class AppModule {}
