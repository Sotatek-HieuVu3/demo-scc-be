export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
}

export enum ESortType {
  PRICE = 'price',
  TIME = 'time',
}

export enum ESortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IBaseNft {
  smallImage?: string;
  largeImage?: string;
  originImage?: string;
  nftId: number;
  nftTokenId: string;
  nftDescription?: string;
}

export interface IRangeNumber {
  min: number;
  max: number;
}

export interface IPagination {
  offset: number;
  limit: number;
}

export enum EStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum EToken {
  SOL = 'SOL',

}

export enum ETimeUnit {
  SECONDS = 'seconds',
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
}
