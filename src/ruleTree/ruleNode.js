const { AND, OR, XOR, TERMINAL } = require('../constants/ruleTypes')

// what does a rule node look like:
/*
{
  type: 'AND' | 'OR' | 'XOR' | 'TERMINAL'
  value: null/true/false
  parent: RuleNode
  rules: RuleNode[]
}

*/
const getTypeOfNode = ruleObject => {
  const terminalTypes = ['boolean', 'function']
  if (terminalTypes.includes(typeof ruleObject)) return TERMINAL
  const allowedTypes = ['AND', 'XOR', 'OR']
  const validDataType = typeof ruleObject === 'object' && typeof ruleObject.type === 'string'
  if ( validDataType && allowedTypes.includes(ruleObject.type.toUpperCase())) return ruleObject.type.toUpperCase()
  throw new Error ('invalid type of rule for' + ruleObject)
}

const getNodeResult = (ruleObject, ruleNode, parentNode) => {
  if (typeof ruleObject === 'boolean') return ruleObject
  if (typeof ruleObject === 'function') return ruleObject(ruleNode, parentNode)
  return null
}

class RuleNode {
  constructor (ruleObject, parentNode = null) {
    this.type = getTypeOfNode(ruleObject)
    this.parent = parentNode
    this.rules = []
    this.value = getNodeResult(ruleObject, this, parentNode)
  }
}

module.exports = RuleNode
