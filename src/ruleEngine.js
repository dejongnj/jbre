const RuleTree = require('./ruleTree')

const ruleEngine = (rulesObject, options = {}) => {
  const ruleTree = new RuleTree(rulesObject, options)
  return ruleTree
}

module.exports = ruleEngine
