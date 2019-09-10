const AND = 'AND'
const OR = 'OR'
const XOR = 'XOR'

const ruleHandling = (rule) => {
  switch (typeof rule) {
    case 'function':
      return rule();
    case 'boolean':
      return rule
    case 'object':
      return engine(rule)
  }
}

const andRule = rulesArray => {
  return rulesArray.every(ruleHandling)
}

const orRule = rulesArray => {
  return rulesArray.some(ruleHandling)
}

const xorRule = rulesArray => {
  return rulesArray.map(ruleHandling)
    .filter(result => result).length === 1
}

/* 
structure of a ruleSet
{
  type: String, // enum ['AND', 'OR', 'XOR']
  rules: [Boolean, Function returning boolean, ruleSet]
}


*/
const engine = (ruleSet) => {
  const { type = 'AND' } = ruleSet
  const methodMap = {
    AND: andRule,
    OR: orRule,
    XOR: xorRule
  }
  const method = methodMap[type] || methodMap.AND
  // const array = new RulesArray(ruleSet.rules)
  return method(ruleSet.rules)
}

module.exports = engine
