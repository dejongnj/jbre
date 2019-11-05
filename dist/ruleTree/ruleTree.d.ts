import RuleNode from './ruleNode';
declare class RuleTree {
    options: any;
    root: RuleNode;
    constructor(rulesObject: any, globalOptions?: any);
    build(ruleObject: any): RuleNode;
    evaluate(): boolean | null;
    getAnalysis(stringifiedJSON?: boolean): any;
}
export default RuleTree;
