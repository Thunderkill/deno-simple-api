export interface Measurement {
  code: string;
  name: string;
  unit: string;
  referenceValues: {
    lower: number;
    upper: number;
  };
}
