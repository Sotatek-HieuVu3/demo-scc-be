import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import { ERC_20_ABI } from '../constants/erc-20.abi';
import { deviceStrByPower, normalizeNumber } from './number.helper';

export class Web3Helper {
  static web3Provider(providerUrl?: string): Web3 {
    const web3 = new Web3();
    const provider = providerUrl?.startsWith('ws')
      ? new Web3.providers.WebsocketProvider(providerUrl)
      : new Web3.providers.HttpProvider(providerUrl);

    web3.setProvider(provider);
    return web3;
  }

  static verifyWalletAddressBySignature(input: {
    address: string;
    message: string;
    signature: string;
  }): boolean {
    const { address, message, signature } = input;

    const web3 = new Web3();
    const recover = web3.eth.accounts.recover(message, signature);
    const recoverConvert = Web3.utils.toChecksumAddress(recover);
    const walletAddress = Web3.utils.toChecksumAddress(address);

    if (recoverConvert && recoverConvert !== walletAddress) {
      throw new Error('Invalid signature!');
    }

    return true;
  }

  static isValidAddress(address: string): boolean {
    const web3 = new Web3();
    return web3.utils.isAddress(address);
  }

  static async getBalance({
    web3,
    walletAddress,
    tokenAddress,
    tokenDecimal = 18,
  }: {
    web3: Web3;
    walletAddress: string;
    tokenAddress?: string;
    tokenDecimal?: number;
  }): Promise<string> {
    if (!tokenAddress) {
      return normalizeNumber(
        new BigNumber(
          web3.utils.fromWei(await web3.eth.getBalance(walletAddress)),
        ).toString(),
      );
    }

    const tokenInst = new web3.eth.Contract(
      ERC_20_ABI as AbiItem[],
      tokenAddress,
    );
    const balance = await tokenInst.methods.balanceOf(walletAddress).call();
    return deviceStrByPower(balance, tokenDecimal);
  }

  static toWei(value: string, decimal = 18): string {
    // TODO: update unit
    let unit: any = 'ether';
    switch (decimal) {
      case 18:
        unit = 'ether';
        break;
    }
    return new Web3().utils.toWei(value, unit);
  }

  static fromWei(value: string, decimal = 18): string {
    // TODO: update unit
    let unit: any = 'ether';
    switch (decimal) {
      case 18:
        unit = 'ether';
        break;
    }
    return new Web3().utils.fromWei(value, unit);
  }

  static async getCurrentGas() {
    const web3 = new Web3();
    const gasPrice = await web3.eth.getGasPrice();
    return gasPrice;
  }
}
