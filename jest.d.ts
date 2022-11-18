// jest.d.ts
import { MatcherFunction } from 'expect';
declare global {
  namespace jest {
    interface Expect {
      numberToHaveLength(expected: number): number;
    }
  }
}
