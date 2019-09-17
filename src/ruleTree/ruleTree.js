const { AND, OR, XOR, TERMINAL } = require('../constants/ruleTypes')
const RuleNode = require('./ruleNode')
const ResultTree = require('../errorTree')

const buildMessage = ruleNode => {
  return {
    name: ruleNode.name,
    message: ruleNode.message,
    value: ruleNode.value,
    rules: []
  }
}

class RuleTree {
  constructor (rulesObject, options = {}) {
    this.root = this.build(rulesObject)
  }
  build (ruleObject, parentNode) { // builds tree from a rules object
    return new RuleNode(ruleObject)
  }
  evaluate () {
   return this.root.value
  }
  analyize () {
    return JSON.stringify(this.root.analysis)
  }
}

module.exports = RuleTree
