import { registerDecorator } from 'class-validator';
import Web3 from 'web3';

export function IsValidAddress() {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'IsWalletAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be a valid wallet address`,
      },
      validator: {
        validate(value: string) {
          const web3 = new Web3();
          return web3.utils.isAddress(value);
        },
      },
    });
  };
}
