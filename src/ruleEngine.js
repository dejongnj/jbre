const { RuleTree } = require('./ruleTree')

const ruleEngine = (rulesObject) => {
  const ruleTree = new RuleTree()
  ruleTree.build(rulesObject)
  return ruleTree
}

module.exports = ruleEngine
