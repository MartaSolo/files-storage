import type { ConcreteComponent } from "nuxt/dist/app/compat/capi";

export interface FileActions {
  id: string;
  label: string;
  svg: string | ConcreteComponent;
}
