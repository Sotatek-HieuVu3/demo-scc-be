import {
  compareNumberStr,
  generateFixedLengthNumber,
  normalizeNumber,
} from './number.helper';

describe('number.helper', () => {
  describe('normalizeNumber', () => {
    it('should convert giant big number to correct format', () => {
      for (const e of [1, 10, 100, 1000, 10000, 10000]) {
        expect(normalizeNumber(`1e+${e}`)).toEqual(`1${'0'.repeat(e)}`);
      }
    });

    it('should convert small number to correct format', () => {
      for (const e of [1, 10, 100, 1000, 10000, 10000]) {
        expect(normalizeNumber(`1e-${e}`)).toEqual(`0.${'0'.repeat(e - 1)}1`);
      }
    });
  });

  describe('generateFixedLengthNumber', () => {
    it('should generate correct number with fixed digit', () => {
      for (const numberOfDigits of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        const number = generateFixedLengthNumber(numberOfDigits);
        expect(number.toString().length).toEqual(numberOfDigits);
      }
    });
  });

  describe('compareNumberStr', () => {
    it('should return 1 if number A is greater than number B', () => {
      expect(compareNumberStr('1', '0')).toEqual(1);
      expect(compareNumberStr('1e2', '10')).toEqual(1);
      expect(compareNumberStr('1e10', '1e9')).toEqual(1);
      expect(compareNumberStr('1e-3', '1e-4')).toEqual(1);
      expect(compareNumberStr('1e-100', '1e-1000')).toEqual(1);
    });
  });
});
