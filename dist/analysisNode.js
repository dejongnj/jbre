"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AnalysisNode {
    constructor(ruleNode, analysisOptions = {}) {
        const { id, value, name, type, description } = ruleNode;
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.value = value;
        this.rules = [];
        const { analyze } = analysisOptions;
        if (analyze && typeof analyze === 'function') {
            analyze(this, ruleNode, analysisOptions);
        }
        else {
            this._defaultAnalysis(ruleNode);
        }
    }
    _defaultAnalysis(ruleNode) {
        const { rules = [] } = ruleNode;
        rules.forEach(ruleNode => {
            this.rules.push(ruleNode.analysis);
        });
    }
}
exports.default = AnalysisNode;
