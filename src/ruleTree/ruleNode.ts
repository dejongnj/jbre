import { AND, EXACTLY_ONE, NAND, NOR, NXOR, OR, TERMINAL, XOR } from '../constants/ruleTypes';
import AnalysisNode from './analysisNode';
import { IFunctionRuleObject, IRuleObject } from './ruleNodeTypes';
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
const isObject = (value: any) => typeof value === 'object';

const getNodeType = (ruleObject: IRuleObject ) => {
  // returns one of TERMINAL, AND, OR, XOR or throws an error
  const terminalTypes = ['boolean', 'function'];
  if (terminalTypes.includes(typeof ruleObject)) return TERMINAL;
  const allowedTypes = [AND, NAND, OR, NOR, XOR, NXOR, EXACTLY_ONE, TERMINAL];
  const validDataType = typeof ruleObject === 'object' && typeof ruleObject.type === 'string';
  const type = (ruleObject === undefined ) ? ''  : ruleObject.type || '';
  if ( validDataType && allowedTypes.includes(type.toUpperCase())) {
    return type.toUpperCase();
  }
  throw new Error ('invalid type of rule for' + ruleObject);
};

const getNodeName = (ruleObject: IRuleObject) => {
  const terminalTypes = ['boolean', 'function'];
  if (terminalTypes.includes(typeof ruleObject)) return `${TERMINAL} rule`;
  const name = ruleObject && ruleObject.name;
  return name ? name : (ruleObject && `${ruleObject.type} rule`) || 'NO INFO RULE NAME';
};

const getTerminalResult = (ruleObject: any, ruleNode: RuleNode) => {
  // this function is only called for TERMINAL types which are leaf nodes where the value is known
  // either by directly asserting it (boolean) or calculating it from a function. It does not have any child nodes
  // ruleObject is either a boolean which is returned as is to get the value
  // or it is a function which is called with the argumnets of both the current ruleNode and the parentRuleNode
  if (typeof ruleObject === 'boolean') return ruleObject;
  if (typeof ruleObject === 'function') return ruleObject(ruleNode);
  throw new Error('only boolean and functions are valid TERMINAL rule types');
};

const getNodeDescription = (ruleObject: any) => {
  const typeofRuleObject = typeof ruleObject;
  return isObject(ruleObject) ? ruleObject.description || '' : `${TERMINAL}-${typeofRuleObject}`;
};

const constructRuleNodeId = (ruleObject: any, parentNode: RuleNode | null) => {
  const suffix = isObject(ruleObject) ? `${ruleObject.type}${ruleObject.name ? `-${ruleObject.name}` : '-no-name-provided'}` : `TERMINAL-${typeof ruleObject}`;
  return parentNode ? `${parentNode.id}-${suffix}` : suffix;
};

const getNodeId = (ruleObject: any, parentNode: RuleNode | null) => {
  return (isObject(ruleObject) && ruleObject.id) ? ruleObject.id : constructRuleNodeId(ruleObject, parentNode);
};

const getOptions = (ruleObject: any) => {
  if (!isObject(ruleObject)) return {};
  const { options = {} } = ruleObject;
  return options;
};

const getMeta = (ruleObject: any, globalOptions: any) => {
  const { meta: globalMeta = {}} = globalOptions;
  if (!isObject(ruleObject)) return Object.assign({}, globalMeta);
  const { meta = {} } = ruleObject;
  if (!isObject(meta)) throw new Error('meta property has to be an object or undefined');
  return Object.assign({}, globalMeta, meta);
};

const typeToEvaluationFunctionsMap: any = {
  AND: (evaluatedRules: RuleNode[]) => evaluatedRules.every((childRuleNode: RuleNode) => !!childRuleNode.value),
  EXACTLY_ONE: (evaluatedRules: RuleNode[]) =>
    evaluatedRules.filter((childRuleNode: RuleNode) => !!childRuleNode.value).length === 1,
  NAND: (evaluatedRules: RuleNode[]) => !evaluatedRules.every((childRuleNode: RuleNode) => !!childRuleNode.value),
  NOR: (evaluatedRules: RuleNode[]) => !evaluatedRules.some((childRuleNode: RuleNode) => !!childRuleNode.value),
  NXOR: (evaluatedRules: RuleNode[]) =>
    !(evaluatedRules.filter((childRuleNode: RuleNode) => !!childRuleNode.value).length % 2 === 1), // even number trues,
  OR: (evaluatedRules: RuleNode[]) => evaluatedRules.some((childRuleNode: RuleNode) => !!childRuleNode.value),
  XOR: (evaluatedRules: RuleNode[]) =>
    evaluatedRules.filter((childRuleNode: RuleNode) => !!childRuleNode.value).length % 2 === 1, // odd number trues
};

const evaluateByType = (type: string) => (ruleNode: RuleNode) => {
  if (type === TERMINAL) return ruleNode;
  const evaluatedRules = ruleNode.evaluateChildRules();
  const evaulationFunction = typeToEvaluationFunctionsMap[type];
  if (!evaulationFunction) throw new Error('unsupported type of evaluation function');
  ruleNode.value = evaulationFunction(evaluatedRules);
  return ruleNode;
};

class RuleNode {
  public id: string;
  public name: string;
  public description: string;
  public type: string;
  public parent: RuleNode | null;
  public globalOptions: any;
  public options: any;
  public meta: any;
  public analysis: AnalysisNode;
  public rules: RuleNode[] = [];
  public value!: boolean | null; // value is not optional; just isn't defined directly in constructor
  constructor (ruleObject: IRuleObject, parentNode: RuleNode | null = null, globalOptions = {}) {
    this.id = getNodeId(ruleObject, parentNode); // to change soon; will require or create id
    this.name = getNodeName(ruleObject);
    this.description = getNodeDescription(ruleObject);
    this.type = getNodeType(ruleObject);
    this.parent = parentNode;
    this.globalOptions = globalOptions;
    this.options = getOptions(ruleObject);
    this.meta = getMeta(ruleObject, globalOptions);
    this.setValue(ruleObject, parentNode, globalOptions);
    this.analysis = this.analyze(); // has to be after this.value is determined
  }
  public evaluate (ruleNode = this) {
    const { type } = ruleNode;
    return evaluateByType(type)(ruleNode);
  }
  public evaluateChildRules (ruleNode = this) {
    const { rules = [] } = ruleNode;
    return rules.map((childRuleNode: RuleNode) => childRuleNode.evaluate());
  }
  public analyze (ruleNode = this) {
    return new AnalysisNode(ruleNode);
  }
  public setValue (ruleObject: any, parentNode: RuleNode | null = null, globalOptions = {}) {
    if (this.type === TERMINAL) {
      this.rules = [];
      if (!isObject(ruleObject)) {
        this.value = getTerminalResult(ruleObject, this);
      } else {

        const { evaluate } = ruleObject;
        if (!['function', 'boolean'].includes(typeof evaluate)) throw new Error('object TERMINAL type must have boolean or function evaluate property');
        this.value = getTerminalResult(evaluate, this);
      }
    } else {
      this.rules = ruleObject.rules.map((childRuleObject: any) => new RuleNode(childRuleObject, this, globalOptions));
      this.value = this.evaluate().value;
    }
  }
}

export default RuleNode;
