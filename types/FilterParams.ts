import type { ModelValue } from "@vuepic/vue-datepicker";

export interface FilterParams {
  name: string;
  types: string[];
  sizeMin: number;
  sizeMax: number;
  dates: ModelValue;
}
