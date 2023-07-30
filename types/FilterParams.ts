export interface FilterParams {
  name: string | null;
  types: string[] | null;
  sizeMin: number | null;
  sizeMax: number | null;
  dates: Date[] | null;
}
