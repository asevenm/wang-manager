export interface Param {
  name: string;
  value: string;
}
export interface Model {
  name: string;
  params?: Param[];
}

export interface Feature {
  images?: Picture[];
  text: string;
}

export interface Picture {
  name: string;
  url: string;
}

export interface ProdutType {
  name: string;
  id: number;
}

export interface RuleForm {
  name: string
  desc: string
  region: string
  typeId: string
  workingPrinciple?: string
  applicationScenes: string[]
  features: Feature[],
  models: Model[]
  images: Picture[]
}

export interface Instrument extends RuleForm {
  type: ProdutType;
}

export interface ProvideValue {
  editRow: RuleForm;
}