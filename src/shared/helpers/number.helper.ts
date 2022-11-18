import BigNumber from 'bignumber.js';
BigNumber.config({
  EXPONENTIAL_AT: 1e5,
});

type TStringOrNumber = string | number;

/**
 *
 * @param value - The value to be formatted
 * @returns string - The formatted value
 *
 * @description
 * This function formats a number to a string which contains e notation
 * E.g: 1e-9 -> 0.0000001
 * E.g: 1e+9 -> 1000000000
 */
export const normalizeNumber = (value: number | string): string => {
  return new BigNumber(value).toString();
  // let parsedValue: any = typeof value === 'string' ? parseFloat(value) : value;
  //
  // if (Math.abs(parsedValue) < 1.0) {
  //   const e = parseInt(value.toString().split('e-')[1]);
  //   if (!isDefined(e)) return parsedValue.toString();
  //   parsedValue = multiplyStr(parsedValue, powStr('10', `${e - 1}`));
  //   return '0.' + new Array(e).join('0') + parsedValue.toString().substring(2);
  // }
  //
  // let e = parseInt(value.toString().split('+')[1]);
  // if (!isDefined(e)) {
  //   return parsedValue.toString();
  // }
  //
  // if (e > 20) {
  //   e -= 20;
  // }
  // return parsedValue / Math.pow(10, e) + new Array(e + 1).join('0');
};

export const generateFixedLengthNumber = (numberOfDigits: number): number => {
  const lowerBound = Math.pow(10, numberOfDigits - 1);
  const upperBound = 9 * Math.pow(10, numberOfDigits - 1);
  return Math.floor(lowerBound + Math.random() * upperBound);
};

export const compareNumberStr = (
  numberA: TStringOrNumber,
  numberB: TStringOrNumber,
): number => {
  /**
   * 1: numberA is greater than numberB
   * 0: numberA is equal to numberB
   * -1: numberA is less than numberB
   */
  return new BigNumber(numberA).comparedTo(new BigNumber(numberB));
};

export const isLessThanStr = (
  numberA: TStringOrNumber,
  numberB: TStringOrNumber,
): boolean => {
  return compareNumberStr(numberA, numberB) === -1;
};

export const isEqualStr = (
  numberA: TStringOrNumber,
  numberB: TStringOrNumber,
): boolean => {
  return compareNumberStr(numberA, numberB) === 0;
};

export const isGreaterStr = (
  numberA: TStringOrNumber,
  numberB: TStringOrNumber,
): boolean => {
  return compareNumberStr(numberA, numberB) === 1;
};

export const minusStr = (
  numberA: TStringOrNumber,
  numberB: TStringOrNumber,
): string => {
  return new BigNumber(numberA).minus(new BigNumber(numberB)).toString();
};

export const plusStr = (
  numberA: TStringOrNumber,
  numberB: TStringOrNumber,
): string => {
  return new BigNumber(numberA).plus(new BigNumber(numberB)).toString();
};

export const multiplyStr = (
  numberA: TStringOrNumber,
  numberB: TStringOrNumber,
): string => {
  return new BigNumber(numberA).multipliedBy(new BigNumber(numberB)).toString();
};

export const deviceStr = (
  numberA: TStringOrNumber,
  numberB: TStringOrNumber,
): string => {
  return new BigNumber(numberA).dividedBy(new BigNumber(numberB)).toString();
};

export const powStr = (
  numberA: TStringOrNumber,
  numberB: TStringOrNumber,
): string => {
  return new BigNumber(numberA).pow(new BigNumber(numberB)).toString();
};

export const deviceStrByPower = (
  numberA: TStringOrNumber,
  numberB: TStringOrNumber,
): string => {
  return new BigNumber(numberA).dividedBy(powStr('10', numberB)).toString();
};

export const randomNumberInRange = (min, max): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};

/**
 * Ref: https://stackoverflow.com/questions/43566019/how-to-choose-a-weighted-random-array-element-in-javascript
 */
export const weightedRandom = <T>(weights: number[], items: T[]): T => {
  const n = weights.length;
  for (let i = 0; i < n; i++) weights[i] += weights[i - 1] || 0;
  const random = Math.random() * weights[n - 1];
  return items[weights.findIndex((weight) => weight > random)];
};

export const generateNumber = (maxNumberOfDigit = 9): number => {
  return Math.round(Math.random() * 10 ** maxNumberOfDigit);
};
