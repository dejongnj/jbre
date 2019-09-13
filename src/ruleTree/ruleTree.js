const { AND, OR, XOR, TERMINAL } = require('../constants/ruleTypes')
const RuleNode = require('./ruleNode')

class RuleTree {
  constructor () {
    this.root = null
  }
  build (ruleObject, parentNode) { // builds tree from a rules object
    const ruleNode = new RuleNode(ruleObject, parentNode)
    if (!this.root) this.root = ruleNode
    if (typeof ruleObject === 'object' && Array.isArray(ruleObject.rules)) {
      ruleObject.rules.forEach(rule => {
        const childRule = this.build(rule, ruleNode)
        ruleNode.rules.push(childRule)
      })
    }
    return ruleNode
  }
  evaluate (ruleNode = this.root) {
    if (!ruleNode) throw new Error('no node to evaluate; you may need to call ruleTree.build before trying to evaluate')
    const { type } = ruleNode
    if (type === TERMINAL) return ruleNode
    if (type === AND) return this._andEvaluate(ruleNode)
    if (type === XOR) return this._xorEvaluate(ruleNode)
    if (type === OR) return this._orEvaluate(ruleNode)
    throw new Error('unrecognized type: ' + type)

  }
  _andEvaluate (parentRuleNode) {
    const { rules = [] } = parentRuleNode
    parentRuleNode.value = rules.map(ruleNode => this.evaluate(ruleNode)).every(ruleNode => !!ruleNode.value)
    return parentRuleNode
  }
  _orEvaluate (parentRuleNode) {
    const { rules = [] } = parentRuleNode
    parentRuleNode.value = rules.map(ruleNode => this.evaluate(ruleNode)).some(ruleNode => !!ruleNode.value)
    return parentRuleNode
  }
  _xorEvaluate (parentRuleNode) {
    const { rules = [] } = parentRuleNode
    parentRuleNode.value = rules.map(ruleNode => this.evaluate(ruleNode))
      .filter(ruleNode => !!ruleNode.value).length === 1 // exactly one true
    return parentRuleNode
  }
}

module.exports = RuleTree
