import { Module } from '@nestjs/common';
import { BankRfController } from './bank-rf.controller';
import { BankRfService } from './bank-rf.service';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  controllers: [BankRfController],
  providers: [BankRfService],
})
export class BankRfModule {}
