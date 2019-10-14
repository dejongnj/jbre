import { AND, NAND, OR, NOR, XOR, NXOR, EXACTLY_ONE, TERMINAL } from '../constants/ruleTypes'
import AnalysisNode from './analysisNode'
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
const isObject = (value: any) => typeof value === 'object'

const getNodeType = (ruleObject:any) => {
  // returns one of TERMINAL, AND, OR, XOR or throws an error
  const terminalTypes = ['boolean', 'function']
  if (terminalTypes.includes(typeof ruleObject)) return TERMINAL
  const allowedTypes = [AND, NAND, OR, NOR, XOR, NXOR, EXACTLY_ONE, TERMINAL]
  const validDataType = typeof ruleObject === 'object' && typeof ruleObject.type === 'string'
  if ( validDataType && allowedTypes.includes(ruleObject.type.toUpperCase())) return ruleObject.type.toUpperCase()
  throw new Error ('invalid type of rule for' + ruleObject)
}

const getNodeName = (ruleObject:any) => {
  const terminalTypes = ['boolean', 'function']
  if (terminalTypes.includes(typeof ruleObject)) return `${TERMINAL} rule`
  let name = ruleObject && ruleObject.name
  return name ? name : (ruleObject && `${ruleObject.type} rule`) || 'NO INFO RULE NAME'
}

const getTerminalResult = (ruleObject:any, ruleNode: RuleNode) => {
  // this function is only called for TERMINAL types which are leaf nodes where the value is known
  // either by directly asserting it (boolean) or calculating it from a function. It does not have any child nodes
  // ruleObject is either a boolean which is returned as is to get the value
  // or it is a function which is called with the argumnets of both the current ruleNode and the parentRuleNode
  if (typeof ruleObject === 'boolean') return ruleObject
  if (typeof ruleObject === 'function') return ruleObject(ruleNode)
  throw new Error('only boolean and functions are valid TERMINAL rule types')
}

const getNodeDescription = (ruleObject: any) => {
  const typeofRuleObject = typeof ruleObject
  return isObject(ruleObject) ? ruleObject.description || '' : `${TERMINAL}-${typeofRuleObject}` 
}

const constructRuleNodeId = (ruleObject: any, parentNode: RuleNode | null) => {
  const suffix = isObject(ruleObject) ? `${ruleObject.type}${ruleObject.name ? `-${ruleObject.name}` : '-no-name-provided'}` : `TERMINAL-${typeof ruleObject}`
  return parentNode ? `${parentNode.id}-${suffix}` : suffix  
}

const getNodeId = (ruleObject: any, parentNode: RuleNode | null) => {
  return (isObject(ruleObject) && ruleObject.id) ? ruleObject.id : constructRuleNodeId(ruleObject, parentNode)
}

const getOptions = (ruleObject: any) => {
  if (!isObject(ruleObject)) return {}
  const { options = {} } = ruleObject
  return options
}

const getMeta = (ruleObject: any, globalOptions: any) => {
  const { meta: globalMeta = {}} = globalOptions
  if (!isObject(ruleObject)) return Object.assign({}, globalMeta)
  const { meta = {} } = ruleObject
  if (!isObject(meta)) throw new Error('meta property has to be an object or undefined')
  return Object.assign({}, globalMeta, meta)
}

const typeToEvaluationFunctionsMap: any = {
  AND: (evaluatedRules: any) => evaluatedRules.every((childRuleNode: RuleNode) => !!childRuleNode.value),
  NAND: (evaluatedRules: any) => !evaluatedRules.every((childRuleNode: RuleNode) => !!childRuleNode.value),
  OR: (evaluatedRules: any) => evaluatedRules.some((childRuleNode: RuleNode) => !!childRuleNode.value),
  NOR: (evaluatedRules: any) => !evaluatedRules.some((childRuleNode: RuleNode) => !!childRuleNode.value),
  XOR: (evaluatedRules: any) => evaluatedRules.filter((childRuleNode: RuleNode) => !!childRuleNode.value).length % 2 === 1, // odd number trues
  NXOR: (evaluatedRules: any) => !(evaluatedRules.filter((childRuleNode: RuleNode) => !!childRuleNode.value).length % 2 === 1), // even number trues,
  EXACTLY_ONE: (evaluatedRules: any) => evaluatedRules.filter((childRuleNode: RuleNode) => !!childRuleNode.value).length === 1,
}

const evaluateByType = (type: string) => (ruleNode: RuleNode) => {
  if (type === TERMINAL) return ruleNode
  const evaluatedRules = ruleNode.evaluateChildRules()
  const evaulationFunction = typeToEvaluationFunctionsMap[type]
  if (!evaulationFunction) throw new Error('unsupported type of evaluation function')
  ruleNode.value = evaulationFunction(evaluatedRules)
  return ruleNode
}

class RuleNode {
  id: string;
  name: string;
  description: string;
  type: string;
  parent: RuleNode | null;
  globalOptions: any;
  options: any;
  meta: any;
  analysis: AnalysisNode;
  rules: RuleNode[] = [];
  value!: boolean | null; // value is not optional; just isn't defined directly in constructor
  constructor (ruleObject: any, parentNode: RuleNode | null = null, globalOptions = {}) {
    this.id = getNodeId(ruleObject, parentNode) // to change soon; will require or create id
    this.name = getNodeName(ruleObject)
    this.description = getNodeDescription(ruleObject)
    this.type = getNodeType(ruleObject)
    this.parent = parentNode
    this.globalOptions = globalOptions
    this.options = getOptions(ruleObject)
    this.meta = getMeta(ruleObject, globalOptions)
    this.setValue(ruleObject, parentNode, globalOptions)
    this.analysis = this.analyze() // has to be after this.value is determined
  }
  evaluate (ruleNode = this) {
    const { type } = ruleNode
    return evaluateByType(type)(ruleNode)
  }
  evaluateChildRules (ruleNode = this) {
    const { rules = [] } = ruleNode
    return rules.map(childRuleNode => childRuleNode.evaluate())
  }
  analyze (ruleNode = this) {
    return new AnalysisNode(ruleNode)
  }
  setValue (ruleObject: any, parentNode: RuleNode | null = null, globalOptions = {}) {
    if (this.type === TERMINAL) {
      this.rules = []
      if (!isObject(ruleObject)) {
        this.value = getTerminalResult(ruleObject, this)
      } else {

        const { evaluate } = ruleObject
        if (!['function', 'boolean'].includes(typeof evaluate)) throw new Error('object TERMINAL type must have boolean or function evaluate property')
        this.value = getTerminalResult(evaluate, this)
      }
    } else {
      this.rules = ruleObject.rules.map((childRuleObject: any) => new RuleNode(childRuleObject, this, globalOptions))
      this.value = this.evaluate().value
    }
  }
}

export default RuleNode
