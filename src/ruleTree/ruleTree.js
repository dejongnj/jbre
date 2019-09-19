const RuleNode = require('./RuleNode')

class RuleTree {
  constructor (rulesObject, globalOptions = {}) {
    this.options = globalOptions
    this.root = this.build(rulesObject, globalOptions)
  }
  build (ruleObject) { // builds tree from a rules object
    return new RuleNode(ruleObject, null, this.options)
  }
  evaluate () {
   return this.root.value
  }
  getAnalysis (stringifiedJSON = false) {
    return stringifiedJSON ? JSON.stringify(this.root.analysis) : this.root.analyze
  }
}

module.exports = RuleTree
