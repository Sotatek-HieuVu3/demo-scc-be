import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';

import { AUTH_STRATEGY, HEADER_KEY } from '../constants/strategy.constant';

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGY.API_KEY,
) {
  constructor(private readonly configService: ConfigService) {
    super(
      { header: HEADER_KEY.API_KEY, prefix: '' },
      true,
      async (apiKey, done) => {
        return this.validate(apiKey, done);
      },
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public validate = (apiKey: string, done: (error: Error, data) => {}) => {
    if (this.configService.get<string>('apiKey') === apiKey) {
      done(null, true);
    }
    done(new Error('Invalid API Key'), null);
  };
}
