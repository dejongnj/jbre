import RuleTree from './ruleTree/ruleTree'

const ruleEngine = (rulesObject: any, options = {}) => {
  const ruleTree = new RuleTree(rulesObject, options)
  return ruleTree
}

export default ruleEngine
