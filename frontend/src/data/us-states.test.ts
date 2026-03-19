import { describe, it, expect } from 'vitest';
import { US_STATES } from './us-states';

describe('US_STATES data', () => {
  it('contains 51 entries (50 states + DC)', () => {
    expect(US_STATES).toHaveLength(51);
  });

  it('each entry has code and name', () => {
    for (const state of US_STATES) {
      expect(state.code).toBeDefined();
      expect(state.code).toHaveLength(2);
      expect(state.name).toBeDefined();
      expect(state.name.length).toBeGreaterThan(0);
    }
  });

  it('all codes are unique', () => {
    const codes = US_STATES.map((s) => s.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('contains California', () => {
    expect(US_STATES.find((s) => s.code === 'CA')?.name).toBe('California');
  });

  it('contains DC', () => {
    expect(US_STATES.find((s) => s.code === 'DC')?.name).toBe('District of Columbia');
  });

  it('codes are all uppercase', () => {
    for (const state of US_STATES) {
      expect(state.code).toBe(state.code.toUpperCase());
    }
  });
});
