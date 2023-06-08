import ConcreteComponent from "nuxt";

export interface FileActions {
  id: string;
  label: string;
  // svg: string | ConcreteComponent<{}, any, any, ComputedOptions, MethodOptions>;
  svg: string | any;
}
