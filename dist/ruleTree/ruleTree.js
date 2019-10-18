"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ruleNode_1 = require("./ruleNode");
class RuleTree {
    constructor(rulesObject, globalOptions = {}) {
        this.options = globalOptions;
        this.root = this.build(rulesObject);
    }
    build(ruleObject) {
        return new ruleNode_1.default(ruleObject, null, this.options);
    }
    evaluate() {
        return this.root.value;
    }
    getAnalysis(stringifiedJSON = false) {
        return stringifiedJSON ? JSON.stringify(this.root.analysis) : this.root.analyze;
    }
}
exports.default = RuleTree;
