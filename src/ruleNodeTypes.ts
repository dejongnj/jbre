
export interface IRuleObject {
  id?: string;
  name?: string;
  description?: string;
  type?: string;
  meta?: any;
  value?: boolean | null;
}

export type IFunctionRuleObject = (...args: any[]) => boolean;
