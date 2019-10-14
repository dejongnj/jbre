"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuleNode_1 = require("./RuleNode");
class RuleTree {
    constructor(rulesObject, globalOptions = {}) {
        this.options = globalOptions;
        this.root = this.build(rulesObject);
    }
    build(ruleObject) {
        return new RuleNode_1.default(ruleObject, null, this.options);
    }
    evaluate() {
        return this.root.value;
    }
    getAnalysis(stringifiedJSON = false) {
        return stringifiedJSON ? JSON.stringify(this.root.analysis) : this.root.analyze;
    }
}
exports.default = RuleTree;
