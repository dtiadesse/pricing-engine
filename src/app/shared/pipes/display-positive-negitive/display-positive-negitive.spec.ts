import { DisplayPositiveNegativePipe } from './display-positive-negative.pipe';

describe('DisplayPositiveNegativePipe', () => {
  it('create an instance', () => {
    const pipe: DisplayPositiveNegativePipe = new DisplayPositiveNegativePipe();
    expect(pipe).toBeTruthy();
  });

  describe('negative scenarios', () => {
    it('should return null', () => {
      const pipe: DisplayPositiveNegativePipe = new DisplayPositiveNegativePipe();
      expect(pipe.transform(null)).toBeNull();
      expect(pipe.transform(undefined)).toBeNull();
      expect(pipe.transform('')).toBeNull();
      expect(pipe.transform(NaN)).toBeNull();
      expect(pipe.transform(0)).toBeNull();
      expect(pipe.transform('0')).toBeNull();
    });
  });

  describe('positive scenarios', () => {
    it('should transform -3 to "-3"', () => {
      const pipe: DisplayPositiveNegativePipe = new DisplayPositiveNegativePipe();
      expect(pipe.transform(-3)).toMatch('-3');
    });

    it('should transform 2 to "+2"', () => {
      const pipe: DisplayPositiveNegativePipe = new DisplayPositiveNegativePipe();
      expect(pipe.transform(2)).toMatch('+2');
    });
  });
});
