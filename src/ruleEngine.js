const { RuleTree } = require('./ruleTree')
const util = require('util')

const ruleEngine = (rulesObject, options = {}) => {
  const ruleTree = new RuleTree(rulesObject, options)
  return ruleTree
}

module.exports = ruleEngine
