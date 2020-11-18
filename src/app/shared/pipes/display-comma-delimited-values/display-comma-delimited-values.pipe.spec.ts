import { DisplayCommaDelimitedValuesPipe } from "./display-comma-delimited-values.pipe";

describe("DisplayCommaDelimitedValuesPipe", () => {
  it("create an instance", () => {
    const pipe: DisplayCommaDelimitedValuesPipe = new DisplayCommaDelimitedValuesPipe();
    expect(pipe).toBeTruthy();
  });

  describe("negative scenarios", () => {
    it("should transform null to null", () => {
      const pipe: DisplayCommaDelimitedValuesPipe = new DisplayCommaDelimitedValuesPipe();
      const mockValues: any = null;
      expect(pipe.transform(mockValues)).toBeNull();
    });
  });

  describe("positive scenarios", () => {
    it('should transform [1, 2, 3, 4, 5] to "1, 2, 3, 4, 5"', () => {
      const pipe: DisplayCommaDelimitedValuesPipe = new DisplayCommaDelimitedValuesPipe();
      const mockValues: number[] = [1, 2, 3, 4, 5];
      expect(pipe.transform(mockValues)).toMatch("1, 2, 3, 4, 5");
    });
  });
});
