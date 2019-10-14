import AnalysisNode from './analysisNode';
declare class RuleNode {
    id: string;
    name: string;
    description: string;
    type: string;
    parent: RuleNode | null;
    globalOptions: any;
    options: any;
    meta: any;
    analysis: AnalysisNode;
    rules: RuleNode[];
    value: boolean | null;
    constructor(ruleObject: any, parentNode?: RuleNode | null, globalOptions?: {});
    evaluate(ruleNode?: this): RuleNode;
    evaluateChildRules(ruleNode?: this): RuleNode[];
    analyze(ruleNode?: this): AnalysisNode;
    setValue(ruleObject: any, parentNode?: RuleNode | null, globalOptions?: {}): void;
}
export default RuleNode;
