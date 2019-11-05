import { IRuleObject } from './ruleNodeTypes';
declare class RuleNode {
    id: string;
    name: string;
    description: string;
    type: string;
    parent: RuleNode | null;
    globalOptions: any;
    options: any;
    meta: any;
    rules: RuleNode[];
    value: boolean | null;
    constructor(ruleObject: IRuleObject, parentNode?: RuleNode | null, globalOptions?: {});
    evaluate(ruleNode?: this): RuleNode;
    evaluateChildRules(ruleNode?: this): RuleNode[];
    setValue(ruleObject: any, parentNode?: RuleNode | null, globalOptions?: {}): void;
}
export default RuleNode;
