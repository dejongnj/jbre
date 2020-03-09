"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ruleTypes_1 = require("./constants/ruleTypes");
// what does a rule node look like:
/*
{
  type: 'AND' | 'OR' | 'XOR' | 'TERMINAL'
  id: String ? required/computed as parentId + type + index number
  name: String (default TYPE + rule) // an easy identifier
  description: ''
  value: null/true/false
  parent: RuleNode
  rules: RuleNode[]
  message: Any (default String "")
}

*/
const allowedTypes = [ruleTypes_1.AND, ruleTypes_1.NAND, ruleTypes_1.OR, ruleTypes_1.NOR, ruleTypes_1.XOR, ruleTypes_1.NXOR, ruleTypes_1.EXACTLY_ONE, ruleTypes_1.TERMINAL];
const randomString = () => Math.random().toString(36).slice(2);
const createId = () => `${randomString()}-${randomString()}`;
const isObject = (value) => typeof value === 'object';
const getNodeType = (ruleObject) => {
    // returns one of TERMINAL, AND, OR, XOR or throws an error
    const validDataType = typeof ruleObject === 'object' && typeof ruleObject.type === 'string';
    const type = (ruleObject === undefined) ? '' : ruleObject.type || '';
    if (validDataType && allowedTypes.includes(type.toUpperCase())) {
        return type.toUpperCase();
    }
    return ruleTypes_1.TERMINAL;
};
const getNodeName = (ruleObject) => (ruleObject && ruleObject.name) || '';
const getTerminalResult = (ruleObject, ruleNode) => {
    // this function is only called for TERMINAL types which are leaf nodes where the value is known
    // either by directly asserting it (boolean) or calculating it from a function. It does not have any child nodes
    // ruleObject is either a boolean which is returned as is to get the value
    // or it is a function which is called with the argumnets of both the current ruleNode and the parentRuleNode
    if (typeof ruleObject === 'boolean')
        return ruleObject;
    if (typeof ruleObject === 'function')
        return ruleObject(ruleNode);
    throw new Error('only boolean and functions are valid TERMINAL rule types');
};
const getNodeDescription = (ruleObject) => isObject(ruleObject) ? ruleObject.description : '';
const getNodeId = (ruleObject) => {
    return (isObject(ruleObject) && ruleObject.id) ? ruleObject.id : createId();
};
const getOptions = (ruleObject) => !isObject(ruleObject) ? {} : ruleObject.options || {};
const getMeta = (ruleObject, globalOptions) => {
    const { meta: globalMeta = {} } = globalOptions;
    if (!isObject(ruleObject))
        return Object.assign({}, globalMeta);
    const { meta = {} } = ruleObject;
    if (!isObject(meta))
        throw new Error('meta property has to be an object or undefined');
    return Object.assign({}, globalMeta, meta);
};
const typeToEvaluationFunctionsMap = {
    AND: (evaluatedRules) => evaluatedRules.every((childRuleNode) => !!childRuleNode.value),
    EXACTLY_ONE: (evaluatedRules) => evaluatedRules.filter((childRuleNode) => !!childRuleNode.value).length === 1,
    NAND: (evaluatedRules) => !evaluatedRules.every((childRuleNode) => !!childRuleNode.value),
    NOR: (evaluatedRules) => !evaluatedRules.some((childRuleNode) => !!childRuleNode.value),
    NXOR: (evaluatedRules) => !(evaluatedRules.filter((childRuleNode) => !!childRuleNode.value).length % 2 === 1),
    OR: (evaluatedRules) => evaluatedRules.some((childRuleNode) => !!childRuleNode.value),
    XOR: (evaluatedRules) => evaluatedRules.filter((childRuleNode) => !!childRuleNode.value).length % 2 === 1,
};
const evaluateByType = (type) => (ruleNode) => {
    if (type === ruleTypes_1.TERMINAL)
        return ruleNode;
    const evaluatedRules = ruleNode.evaluateChildRules();
    const evaulationFunction = typeToEvaluationFunctionsMap[type];
    if (!evaulationFunction)
        throw new Error('unsupported type of evaluation function');
    ruleNode.value = evaulationFunction(evaluatedRules);
    return ruleNode;
};
class RuleNode {
    constructor(ruleObject, parentNode = null, globalOptions = {}) {
        this.rules = [];
        this.id = getNodeId(ruleObject); // to change soon; will require or create id
        this.name = getNodeName(ruleObject);
        this.description = getNodeDescription(ruleObject);
        this.type = getNodeType(ruleObject);
        this.parent = parentNode;
        this.globalOptions = globalOptions;
        this.options = getOptions(ruleObject);
        this.meta = getMeta(ruleObject, globalOptions);
        this.setValue(ruleObject, parentNode, globalOptions);
    }
    evaluate(ruleNode = this) {
        const { type } = ruleNode;
        return evaluateByType(type)(ruleNode);
    }
    evaluateChildRules(ruleNode = this) {
        const { rules = [] } = ruleNode;
        return rules.map((childRuleNode) => childRuleNode.evaluate());
    }
    setValue(ruleObject, parentNode = null, globalOptions = {}) {
        if (this.type === ruleTypes_1.TERMINAL) {
            this.rules = [];
            if (!isObject(ruleObject)) {
                this.value = getTerminalResult(ruleObject, this);
            }
            else {
                const { evaluate } = ruleObject;
                if (!['function', 'boolean'].includes(typeof evaluate))
                    throw new Error('object TERMINAL type must have boolean or function evaluate property');
                this.value = getTerminalResult(evaluate, this);
            }
        }
        else {
            this.rules = ruleObject.rules.map((childRuleObject) => new RuleNode(childRuleObject, this, globalOptions));
            this.value = this.evaluate().value;
        }
    }
}
exports.default = RuleNode;
