import * as fromCounter from './counter.actions';

describe('Counter Increment', () => {
  it('should return an action', () => {
    expect(fromCounter.counterIncrement().type).toBe('[Counter Component] Increment');
  });
});


describe('Counter Decrement', () => {
  it('should return an action', () => {
    expect(fromCounter.counterDecrement().type).toBe('[Counter Component] Decrement');
  });
});

describe('Counter Reset', () => {
  it('should return an action', () => {
    expect(fromCounter.counterReset().type).toBe('[Counter Component] Reset');
  });
});