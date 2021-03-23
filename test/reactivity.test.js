import {
  effect,
  reactive
} from '../src/reactivity.js';

describe('reactivity', () => {
  it('should observe basic properties', () => {
    let dummy;
    const counter = reactive({ nun: 0 });
    effect(() => dummy = counter.num);

    expect(dummy).toBe(0);
    counter.num = 10;
    expect(dummy).toBe(10);
  })
})
