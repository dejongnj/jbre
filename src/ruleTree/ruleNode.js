const { AND, OR, XOR, TERMINAL } = require('../constants/ruleTypes')
const AnalysisNode = require('./analysisNode')
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
const getTypeOfNode = ruleObject => {
  // returns one of TERMINAL, AND, OR, XOR or throws an error
  const terminalTypes = ['boolean', 'function']
  if (terminalTypes.includes(typeof ruleObject)) return TERMINAL
  const allowedTypes = [AND, XOR, OR, TERMINAL]
  const validDataType = typeof ruleObject === 'object' && typeof ruleObject.type === 'string'
  if ( validDataType && allowedTypes.includes(ruleObject.type.toUpperCase())) return ruleObject.type.toUpperCase()
  throw new Error ('invalid type of rule for' + ruleObject)
}

const getNodeName = (ruleObject) => {
  const terminalTypes = ['boolean', 'function']
  if (terminalTypes.includes(typeof ruleObject)) return `${TERMINAL} rule`
  let name = ruleObject && ruleObject.name
  return name ? name : (ruleObject && `${ruleObject.type} rule`) || 'NO INFO RULE NAME'
}

const getTerminalResult = (ruleObject, ruleNode, parentNode) => {
  // this function is only called for TERMINAL types which are leaf nodes where the value is known
  // either by directly asserting it (boolean) or calculating it from a function. It does not have any child nodes
  // ruleObject is either a boolean which is returned as is to get the value
  // or it is a function which is called with the argumnets of both the current ruleNode and the parentRuleNode
  if (typeof ruleObject === 'boolean') return ruleObject
  if (typeof ruleObject === 'function') return ruleObject(ruleNode)
  throw new Error('only boolean and functions are valid rule types')
}

const getNodeDescription = (ruleObject) => {
  const typeofRuleObject = typeof ruleObject
  return typeofRuleObject === 'object' ? ruleObject.description || '' : `${TERMINAL}-${typeofRuleObject}` 
}

const constructRuleNodeId = ( ruleObject, parentNode) => {
  const typeofRuleObject = typeof ruleObject
  const suffix = (typeofRuleObject === 'object') ? `${ruleObject.type}${ruleObject.name ? `-${ruleObject.name}` : '-no-name-provided'}` : `TERMINAL-${typeof ruleObject}`
  return parentNode ? `${parentNode.id}-${suffix}` : suffix  
}

const getNodeId = (ruleObject, parentNode) => {
  const typeofRuleObject = typeof ruleObject
  return (typeofRuleObject === 'object' && ruleObject.id) ? ruleObject.id : constructRuleNodeId(ruleObject, parentNode)
}

class RuleNode {
  constructor (ruleObject, parentNode = null) {
    this.id = getNodeId(ruleObject, parentNode) // to change soon; will require or create id
    this.name = getNodeName(ruleObject)
    this.description = getNodeDescription(ruleObject)
    this.type = getTypeOfNode(ruleObject)
    this.parent = parentNode
    // this function has to be last, since if the rule is a function,
    // the function gets passed the ruleNode instance,
    // which it can use to modify the node if necessary (e.g. set message etc.)
    if (this.type === TERMINAL) {
      this.rules = []
      this.value = getTerminalResult(ruleObject, this, parentNode)
    } else {
      this.rules = ruleObject.rules.map(childRuleObject => new RuleNode(childRuleObject, this))
      this.value = this.evaluate().value
    }
    this.analysis = this.analyze()
  }
  evaluate (ruleNode = this) {
    if (!ruleNode) throw new Error('no node to evaluate; you may need to call ruleTree.build before trying to evaluate')
    const { type } = ruleNode
    if (type === TERMINAL) return this._terminalEvaluate(ruleNode)
    if (type === AND) return this._andEvaluate(ruleNode)
    if (type === XOR) return this._xorEvaluate(ruleNode)
    if (type === OR) return this._orEvaluate(ruleNode)
    throw new Error('unrecognized type: ' + type)
  }
  _andEvaluate (ruleNode) {
    const evaluatedRules = ruleNode.evaluateChildRules()
    const value = evaluatedRules.every(childRuleNode => !!childRuleNode.value)
    ruleNode.value = value
    return ruleNode
  }
  _orEvaluate (ruleNode) {
    const evaluatedRules = ruleNode.evaluateChildRules()
    const value = evaluatedRules.some(childRuleNode => !!childRuleNode.value)
    ruleNode.value = value
    return ruleNode
  }
  _xorEvaluate (ruleNode) {
    const evaluatedRules = ruleNode.evaluateChildRules()
    const value = evaluatedRules.filter(childRuleNode => !!childRuleNode.value).length === 1 // exactly one true
    ruleNode.value = value
    return ruleNode
  }
  _terminalEvaluate (ruleNode) {
    return ruleNode
  }
  evaluateChildRules (ruleNode = this) {
    const { rules = [] } = ruleNode
    return rules.map(childRuleNode => childRuleNode.evaluate())
  }
  analyze (ruleNode = this) {
    return new AnalysisNode(ruleNode)
  }
}

module.exports = RuleNode
