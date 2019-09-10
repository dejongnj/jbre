const andRuleAllTrue = {
  type: 'AND',
  rules: [
    () => true,
    () => true
  ]
}

const andRuleAllFalse = {
  type: 'AND',
  rules: [
    () => false,
    () => false
  ]
}

const andRuleOneFalse = {
  type: 'AND',
  rules: [
    () => true,
    () => false
  ]
}

const andRuleNestedAllTrue = {
  type: 'AND',
  rules: [
    () => true,
    () => true,
    {
      type: 'AND',
      rules: [
        () => true,
        () => true,
        () => true
      ]
    }
  ]
}

const andRuleNestedNestedFalse = {
  type: 'AND',
  rules: [
    () => true,
    () => true,
    {
      type: 'AND',
      rules: [
        () => true,
        () => false,
        () => true
      ]
    }
  ]
}

const andRuleNestedRootFalse = {
  type: 'AND',
  rules: [
    () => true,
    () => false,
    {
      type: 'AND',
      rules: [
        () => true,
        () => true,
        () => true
      ]
    }
  ]
}

const orRuleAllTrue = {
  type: 'OR',
  rules: [
    () => true,
    () => true
  ]
}

const orRuleAllFalse = {
  type: 'OR',
  rules: [
    () => false,
    () => false
  ]
}

const orRuleOneFalse = {
  type: 'OR',
  rules: [
    () => true,
    () => false
  ]
}

const xorRuleAllTrue = {
  type: 'XOR',
  rules: [
    () => true,
    () => true
  ]
}

const xorRuleAllFalse = {
  type: 'XOR',
  rules: [
    () => false,
    () => false
  ]
}

const xorRuleOneTrue = {
  type: 'XOR',
  rules: [
    () => true,
    () => false
  ]
}

module.exports = {
  andRuleAllTrue,
  andRuleAllFalse,
  andRuleOneFalse,
  andRuleNestedAllTrue,
  andRuleNestedNestedFalse,
  andRuleNestedRootFalse,
  orRuleAllTrue,
  orRuleAllFalse,
  orRuleOneFalse,
  xorRuleAllTrue,
  xorRuleAllFalse,
  xorRuleOneTrue
}