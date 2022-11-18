import { NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  EntityRepository,
  FindConditions,
  FindOneOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { OrderByCondition } from 'typeorm/find-options/OrderByCondition';

import {
  IPaginatedResponse,
  IPagination,
} from '../interfaces/common.interface';

@EntityRepository()
export class CustomRepository<T> extends Repository<T> {
  /**
   * !! This is common selection for nft query, note that in case you change
   * the alias of the nft, you'll need to write it in your methods instead of using this
   */
  protected baseNftSelections = [
    'nft.smallImage as smallImage',
    'nft.largeImage as largeImage',
    'nft.originImage as originImage',
    'nft.id as nftId',
    'nft.tokenId as nftTokenId',
    'nft.description as nftDescription',
  ];

  protected baseNftMarketSelections = [
    'nft_market.updated_at as startedSellingTime',
    'nft_market.price as price',
    'nft_market.currency as currency',
    'nft_market.id as nftMarketItemId',
    'nft_market.currencyAddress as currencyAddress',
    'nft_market.status as nftMarketStatus',
    'nft_market.currencyDecimal as currencyDecimal',
  ];

  async findOneOrCreate(
    options: FindOneOptions,
    fallbackObj?: DeepPartial<T>,
  ): Promise<T> {
    const record = await this.findOne(options);
    if (record) return record;
    if (!fallbackObj) {
      throw new Error('Entity not found!');
    }
    return this.save(fallbackObj);
  }

  async getById(id: number): Promise<T> {
    const record = await this.findOne(id);
    if (!record) {
      throw new NotFoundException();
    }

    return record;
  }

  async findByColumn(
    columnName: keyof T,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    columnValue: any,
    pick?: (keyof T)[],
    lock?: any,
  ): Promise<Partial<T>> {
    return this.findOne({
      where: {
        [columnName]: columnValue,
      },
      ...(pick ? { select: pick } : {}),
      ...(lock ? { lock } : {}),
    });
  }

  async findOnPage({
    options,
    page,
    perPage,
    conditions,
  }: {
    page: number;
    perPage: number;
    conditions?: FindConditions<T>;
    options?: FindOneOptions<T>;
  }): Promise<Partial<T>[]> {
    return this.find({
      ...(conditions ? { where: conditions } : {}),
      ...options,
      skip: page * perPage,
      take: perPage,
    });
  }

  async findListWithPagination<V>({
    queryBuilder,
    pagination,
    selects,
    orderByCondition,
  }: {
    queryBuilder: SelectQueryBuilder<T>;
    pagination: IPagination;
    selects: string[];
    orderByCondition: OrderByCondition;
  }): Promise<IPaginatedResponse<V>> {
    const [data, total] = await Promise.all([
      queryBuilder
        .select(selects)
        .offset(pagination.offset)
        .limit(pagination.limit)
        .orderBy(orderByCondition)
        .getRawMany(),
      queryBuilder.getCount(),
    ]);

    return {
      data,
      total,
    };
  }
}
