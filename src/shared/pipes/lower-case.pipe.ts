import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class LowerCasePipe implements PipeTransform<string, number> {
  transform(value: any, metadata: ArgumentMetadata): number {
    try {
      if (typeof value !== 'string') {
        value = value.toString();
      }
      return value?.toLowerCase();
    } catch (e) {
      return value;
    }
  }
}
