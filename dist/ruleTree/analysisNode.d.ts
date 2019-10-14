import RuleNode from './ruleNode';
declare class AnalysisNode {
    id: string;
    name: string;
    description: string;
    type: string;
    value: boolean | null;
    rules: AnalysisNode[];
    constructor(ruleNode: RuleNode, analysisOptions?: any);
    _defaultAnalysis(ruleNode: RuleNode): void;
}
export default AnalysisNode;
