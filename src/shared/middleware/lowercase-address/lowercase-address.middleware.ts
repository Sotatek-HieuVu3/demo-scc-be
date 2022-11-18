import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LowercaseAddressMiddleware implements NestMiddleware {
  private addressFields: string[] = ['address', 'walletAddress', 'receiver'];

  private transformDesiredFieldToLowercase(obj: any, fields: string[]) {
    fields.forEach((field) => {
      if (obj[field]) {
        obj[field] = obj[field].toLowerCase();
      }
    });

    return obj;
  }

  use(req: Request, res: Response, next: NextFunction): void {
    console.log('req', req, req.query, req.get('walletAddress'));
    if (req.params) {
      console.log('req.params', req.params);
      req.params = this.transformDesiredFieldToLowercase(
        req.params,
        this.addressFields,
      );
    }

    if (req.body) {
      req.body = this.transformDesiredFieldToLowercase(
        req.body,
        this.addressFields,
      );
    }

    next();
  }
}
