import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BankRfModule } from './bank-rf/bank-rf.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot(),
    BankRfModule
  ], 
  controllers: [],
  providers: [], 
})
export class AppModule {}
