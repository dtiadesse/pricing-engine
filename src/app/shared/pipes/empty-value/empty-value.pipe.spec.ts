import { EmptyValuePipe } from './empty-value.pipe';

describe('EmptyValuePipe', () => {
  it('create an instance', () => {
    const pipe: EmptyValuePipe = new EmptyValuePipe();
    expect(pipe).toBeTruthy();
  });
});
