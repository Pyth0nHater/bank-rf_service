import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

import axios from 'axios';
import * as crypto from 'crypto';
import { KafkaMessageDto } from 'src/dto/kafka-message.dto';



@Injectable()
export class BankRfService {
  constructor(
  ) {}
  ;
  private readonly terminalKey = process.env.TERMINAL_KEY;
  private readonly password = process.env.PASSWORD;
  private readonly apiBaseUrl = process.env.TEST_URL;

  
 
  private generateToken(params: Record<string, any>): string {
    const rootParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (typeof value !== 'object') acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    rootParams['Password'] = this.password;

    const sortedParams = Object.keys(rootParams)
      .sort()
      .reduce((acc, key) => acc + rootParams[key], '');

    return crypto.createHash('sha256').update(sortedParams, 'utf8').digest('hex');
  }

  async handleCardProcessing(message: KafkaMessageDto) {
    const {
      user_id,
      user_email,
      user_phone,
      amount,
      payment_name,
      card_hash,
      order_id,
      transactionId,
    } = message;
    console.log(this.terminalKey);
  
    const initParams = {
      TerminalKey: this.terminalKey,
      Amount: amount,
      OrderId: '46',
      Reccurent: 'Y',
      CustomerKey: user_id,
      NotificationURL: '',
      Description: payment_name,
      DATA: {
        Phone: user_phone,
        Email: user_email,
      },
      Receipt: {
        Email: user_email,
        Phone: user_phone,
        Taxation: 'osn',
        Items: [
          {
            Name: payment_name,
            Price: amount,
            Quantity: 1,
            Amount: amount,
            Tax: 'vat10',
          },
        ],
      },
    };
  
    initParams['Token'] = this.generateToken(initParams);
    console.log('Init request:', initParams);
  
    const initResponse = await axios.post(`${this.apiBaseUrl}/Init`, initParams);
    console.log('Init response:', initResponse.data);
  
    if (!initResponse.data.Success) {
      throw new Error('Init transaction failed');
    }
  
    const { PaymentId } = initResponse.data;
  
    const finishParams3DS = {
      TerminalKey: this.terminalKey,
      PaymentId: PaymentId,
      CardData: card_hash,
      Route: 'ACQ',
      Source: 'cards',
      DATA: {
        threeDSCompInd: 'Y',
        language: 'en',
        timezone: '180',
        screen_height: '1800',
        screen_width: '2880',
        cresCallbackUrl: '',
      },
    };
    finishParams3DS['Token'] = this.generateToken(finishParams3DS);
  
    const finishResponse3DS = await axios.post(`${this.apiBaseUrl}/Check3dsVersion`, finishParams3DS);
    console.log('3DS response:', finishResponse3DS.data);
  
    const { Version, ACSUrl, MD, PaReq, threeDSServerTransID, acsTransID, messageVersion, ThreeDSMethodURL } =
      finishResponse3DS.data;
  
    if (ThreeDSMethodURL) {
      const threeDSMethodData = Buffer.from(
        JSON.stringify({
          threeDSServerTransID,
          threeDSMethodNotificationURL: 'https://your-server-url.com/3ds-method-notification',
        })
      ).toString('base64');
  
      console.log('ThreeDSMethodURL:', ThreeDSMethodURL);
      console.log('threeDSMethodData:', threeDSMethodData);
  
      // This step is typically handled on the client side in an iframe.
  
    if (Version === '1.0.0') {
      const submitParams = {
        MD,
        PaReq,
        TermURL: 'https://your-redirect-url.com/3ds-callback',
      };
  
      const submitResponse = await axios.post(ACSUrl, submitParams, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log('Submit3DSAuthorization response:', submitResponse.data);
    } else if (Version === '2.1.0') {
      const creq = Buffer.from(
        JSON.stringify({
          threeDSServerTransID,
          acsTransID,
          challengeWindowSize: '05',
          messageType: 'CReq',
          messageVersion,
        })
      ).toString('base64');
  
      const submitParams = { creq };
  
      const submitResponse = await axios.post(ACSUrl, submitParams, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log('Submit3DSAuthorizationV2 response:', submitResponse.data);
    } else {
      console.log('Unsupported 3DS version:', Version);
    }
    }
    const finishParams = {
      TerminalKey: this.terminalKey,
      PaymentId: PaymentId,
      CardData: card_hash,
      Route: 'ACQ',
      Source: 'cards',
      DATA: {
        threeDSCompInd: 'Y',
        language: 'en',
        timezone: '180',
        screen_height: '1800',
        screen_width: '2880',
        cresCallbackUrl: '',
      },
    };
    finishParams['Token'] = this.generateToken(finishParams);
  
    const finishResponse = await axios.post(`${this.apiBaseUrl}/FinishAuthorize`, finishParams);
    console.log('FinishAuthorize response:', finishResponse.data);
  

    const GetCardList = {
      TerminalKey: this.terminalKey,
      CustomerKey: user_id,
    };
    GetCardList['Token'] = this.generateToken(GetCardList);
  
    const GetCardListResponse = await axios.post(`${this.apiBaseUrl}/GetCardList`, GetCardList);
    console.log('GetState response:', GetCardListResponse.data);
  }
  

  async handleChargeProcessing(message: KafkaMessageDto) {
      const { transactionId, user_id, card_hash } = message;
      console.log(message)

      const initParams = {
        TerminalKey: this.terminalKey,
        Amount: 100,
        OrderId: transactionId,
        Reccurent: 'Y',
        CustomerKey: '2',
        NotificationURL: '',
        Description: 'Активация карты',
        DATA: {
          Phone: '+71234567890',
          Email: 'a@test.com',
        },
        Receipt: {
          Email: 'a@test.ru',
          Phone: '+79031234567',
          Taxation: "osn",
          Items: [
            {
              Name: 'Активция карты',
              Price: 100,
              Quantity: 1,
              Amount: 100,
              Tax: 'vat10',
            },
          ],
        },
      };

      initParams['Token'] = this.generateToken(initParams);
      console.log('Init request:', initParams);

      const initResponse = await axios.post(`${this.apiBaseUrl}/Init`, initParams);
      console.log('Init response:', initResponse.data);

      if (!initResponse.data.Success) {
        throw new Error('Init transaction failed');
      }

      const { PaymentId } = initResponse.data;

      const ChargeParams  = {
        TerminalKey: this.terminalKey,
        PaymentId: PaymentId,
        RebillId: '1733854321033',
        SendEmail: true,
        InfoEmail: 'a@test.com'
 
      };
      ChargeParams['Token'] = this.generateToken(ChargeParams);
  
      const ChargeResponse = await axios.post(`${this.apiBaseUrl}/Charge`, ChargeParams);
      console.log('Charge response:', ChargeResponse.data);
  }

}
