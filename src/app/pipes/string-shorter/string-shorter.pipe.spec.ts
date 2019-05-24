import { StringShorterPipe } from './string-shorter.pipe';

describe('StringShorterPipe', () => {
  it('create an instance', () => {
    const pipe = new StringShorterPipe();
    expect(pipe).toBeTruthy();
  });
});
