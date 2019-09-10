const shuffle = require('shuffle-array')
const _ = require('lodash')

const createEmptyRule = (type = 'AND') => ({
  type,
  rules: []
})

const randomFromRange = (lower = 0, upper = 10) => {
  if (upper < lower) upper = lower
  return Math.floor(lower + Math.random()*(upper -lower + 1))
}

class RuleSet {
  constructor (type = 'AND') {
    if (typeof type === 'string') {
      this.ruleSet = createEmptyRule(type)
    } else if (typeof type === 'object') {
      this.ruleSet = _.cloneDeep(type)
    }
  }
  setType (type = 'AND') {
    this.ruleSet.type = type
  }
  addRules (rule = true, repeat = 1) {
    if (Array.isArray(rule)) this.ruleSet.rules.push(...rule)
    else {
      for (let i = 0; i < repeat; i++) {
        this.ruleSet.rules.push(rule)
      }
    }
    return this
  }
  shuffle () {
    this.ruleSet.rules = shuffle(this.ruleSet.rules)
    return this
  }
  clearRules () {
    this.ruleSet.rules = []
    return this
  }
  getRuleSet () {
    return _.cloneDeep(this.ruleSet)
  }
  clone () {
    return new RuleSet(_.cloneDeep(this.ruleSet))
  }
}

const createRuleSet = type => new RuleSet(type)

const createVariableRules = (logicalType = 'AND', options = {}) => {
  const { functionTrue = 0, functionFalse = 0, booleanTrue = 0, booleanFalse = 0, rules = [], returnWrapper = false} = options
  const ruleSetInstance = createRuleSet(logicalType)
    .addRules(() => true, functionTrue)
    .addRules(() => false, functionFalse)
    .addRules(true, booleanTrue)
    .addRules(false, booleanFalse)
    .addRules(rules)
    .shuffle()

  return returnWrapper ? ruleSetInstance : ruleSetInstance.getRuleSet()
}

const createAllTrue = (logicalType = 'AND', ruleType = Function, repeat = 3) => {
  const options = {}
  if (ruleType === Function) options.functionTrue = repeat
  else if (ruleType === Boolean) options.booleanTrue = repeat
  return createVariableRules(logicalType, options)
}

const createAllFalse = (logicalType = 'AND', ruleType = Function, repeat = 3) => {
  const options = {}
  if (ruleType === Function) options.functionFalse = repeat
  else if (ruleType === Boolean) options.booleanFalse = repeat
  return createVariableRules(logicalType, options)
}


const createOneTrue = (logicalType = 'AND', ruleType = Function, repeat = 3) => {
  const options = {}
  if (ruleType === Function) {
    options.functionTrue = 1
    options.functionFalse = repeat - 1
  } else if (ruleType === Boolean) {
    options.booleanTrue = 1
    options.booleanFalse = repeat - 1
  }
  return createVariableRules(logicalType, options)
}

const createOneFalse = (logicalType = 'AND', ruleType = Function, repeat = 3) => {
  const options = {}
  if (ruleType === Function) {
    options.functionFalse = 1
    options.functionTrue = repeat - 1
  } else if (ruleType === Boolean) {
    options.booleanFalse = 1
    options.booleanTrue = repeat - 1
  }
  return createVariableRules(logicalType, options)
}


module.exports = {
  createAllTrue,
  createAllFalse,
  createOneTrue,
  createOneFalse,
  createVariableRules,
  createRuleSet,
  randomFromRange
}