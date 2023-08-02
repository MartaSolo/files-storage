import type { ConcreteComponent } from "vue";

export interface FileActions {
  id: string;
  label: string;
  svg: string | ConcreteComponent;
}
