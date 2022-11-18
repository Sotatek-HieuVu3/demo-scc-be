expect.extend({
  numberToHaveLength(received: number, numberOfDigits: number) {
    const pass =
      typeof received === 'number' &&
      received.toString().length === numberOfDigits;

    if (pass) {
      return {
        message: () =>
          `expected ${received} to have length of ${numberOfDigits}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to have length of ${numberOfDigits}`,
        pass: false,
      };
    }
  },
});
