import { Column, ColumnOptions } from 'typeorm';

import {
  HmacTransformer,
  HmacTransformerOptions,
} from '../transformer/hmac.transformer';

export function HmacColumn(
  transformerOptions?: HmacTransformerOptions,
  options?: ColumnOptions,
): PropertyDecorator {
  const columnOptions = {
    select: false,
    type: 'varchar',
    ...options,
  } as ColumnOptions;
  columnOptions.transformer = new HmacTransformer(transformerOptions);
  return Column(columnOptions);
}
