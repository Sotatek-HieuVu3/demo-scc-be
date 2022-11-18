export const randomString = (length: number): string => {
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export const randomWords = (length: number): string => {
  const words = [];
  for (let i = 0; i < length; i++) {
    words.push(randomString(Math.floor(Math.random() * 10) + 1));
  }
  return words.join(' ');
};

export const convertSnakeCaseToCamelCase = (str: string): string => {
  return str.replace(/_([0-9]|[a-z])/g, (_, g) => g.toUpperCase());
};

export const uppercaseFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
