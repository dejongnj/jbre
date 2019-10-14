import RuleNode from './RuleNode';
declare class RuleTree {
    options: any;
    root: RuleNode;
    constructor(rulesObject: any, globalOptions?: any);
    build(ruleObject: any): RuleNode;
    evaluate(): boolean | null;
    getAnalysis(stringifiedJSON?: boolean): string | ((ruleNode?: RuleNode) => import("./analysisNode").default);
}
export default RuleTree;
