import { convertSnakeCaseToCamelCase } from './string.helper';

export const transformKeysToCamelCase = (obj: any): any => {
  if (!obj) {
    return obj;
  }

  if (obj instanceof Array) {
    return obj.map((item) => transformKeysToCamelCase(item));
  }

  if (obj instanceof Object) {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
      newObj[convertSnakeCaseToCamelCase(key)] = obj[key];
    });
    return newObj;
  }

  return obj;
};

export function pick<O, T extends keyof O>(obj: O, keys: T[]) {
  const newObj: any = {};
  if (!obj) {
    return {};
  }
  for (const key of keys) {
    if (key in obj) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

export const deepPick = <T>(obj: T, path: string): any => {
  return path.split('.').reduce((prev, curr) => prev[curr], obj);
};
