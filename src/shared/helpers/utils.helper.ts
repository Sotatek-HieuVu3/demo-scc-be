import crypto from 'crypto';

export const parseJson = (json: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('error', error);
    return null;
  }
};

export const raceTimeOut = async (
  callback: Promise<any>,
  callbackTimeOut: Promise<any>,
  timeout: number,
): Promise<any> => {
  const callTimeoutFunc = new Promise((resolve) => {
    setTimeout(() => {
      resolve(callbackTimeOut);
    }, timeout);
  });
  return Promise.race([callback, callTimeoutFunc]);
};

export const sleep = async (time: number): Promise<boolean> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(true);
    }, time),
  );
};

export const batchPromisesWithRetry = async (
  promises: Promise<any>[],
  retryCount = 0,
): Promise<any[]> => {
  const wrappedPromises = promises.map((promise: Promise<any>) => {
    return {
      status: 'pending',
      callback: promise,
      result: null,
    };
  });

  do {
    const responses = await Promise.allSettled(
      wrappedPromises.map(async (wrappedPromise) => {
        if (wrappedPromise.status === 'fullfilled') {
          return wrappedPromise;
        }
        const value = await wrappedPromise.callback;
        wrappedPromise.status = 'fullfilled';
        wrappedPromise.result = value;
        return wrappedPromise;
      }),
    );
    const failedPromises = responses.filter(
      (result) => result.status === 'rejected',
    );
    if (!failedPromises.length) {
      return responses
        .map(
          (response) =>
            response?.status === 'fulfilled' && response.value?.result,
        )
        .filter(Boolean);
    }
  } while (retryCount--);

  throw new Error('Failed to batch promises');
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isNullOrUndefined = (value: any): boolean => {
  return value === null || value === undefined;
};

export const hashSHA256 = (input: string): string => {
  return crypto.createHash('sha256').update(input).digest('base64');
};

export const parseJSON = (s: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
};
