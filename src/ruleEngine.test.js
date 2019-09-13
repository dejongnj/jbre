const chai = require('chai')
const { RuleTree } = require('./ruleTree')
const testRules = require('./testdata')

const { expect } = chai
const { createAllTrue, createAllFalse, createOneTrue, 
        createOneFalse, createVariableRules, randomFromRange } = testRules

describe('rules', () => {
  const getFinalValue = rulesObject => {
    const ruleTree = new RuleTree()
    ruleTree.build(rulesObject)
    return ruleTree.evaluate().value
  }
  describe('basic', () => {
    describe('AND', () => {
      it('should handle function rules resulting in true', () => {
        const allTrue = createAllTrue('AND', Function)
        expect(getFinalValue(allTrue)).to.equal(true)
        const randomAllTrue = createAllTrue('AND', Function, randomFromRange(1, 10))
        expect(getFinalValue(randomAllTrue)).to.equal(true)
      })
      it('should handle boolean rules resulting in true', () => {
        const allTrue = createAllTrue('AND', Boolean)
        expect(getFinalValue(allTrue)).to.equal(true)
        const randomAllTrue = createAllTrue('AND', Boolean, randomFromRange(1, 10))
        expect(getFinalValue(randomAllTrue)).to.equal(true)
      })
      it('should handle function rules resulting in false', () => {
        const allFalse = createAllFalse('AND', Function)
        expect(getFinalValue(allFalse)).to.equal(false)
        const oneFalse = createOneFalse('AND', Function)
        expect(getFinalValue(oneFalse)).to.equal(false)
        const randomOneFalse = createOneFalse('AND', Function, randomFromRange(1, 10))
        expect(getFinalValue(randomOneFalse)).to.equal(false)
        const options = {
          functionTrue: randomFromRange(0, 10),
          functionFalse: randomFromRange(1, 10)
        }
        const randomVariableFalse = createVariableRules('AND', options)
        expect(getFinalValue(randomVariableFalse)).to.equal(false)
      })
      it('should handle boolean rules resulting in false', () => {
        const allFalse = createAllFalse('AND', Boolean)
        expect(getFinalValue(allFalse)).to.equal(false)
        const oneFalse = createOneFalse('AND', Boolean)
        expect(getFinalValue(oneFalse)).to.equal(false)
        const randomOneFalse = createOneFalse('AND', Boolean, randomFromRange(1, 10))
        expect(getFinalValue(randomOneFalse)).to.equal(false)
        const options = {
          functionTrue: randomFromRange(0, 10),
          functionFalse: randomFromRange(1, 10)
        }
        const randomVariableFalse = createVariableRules('AND', options)
        expect(getFinalValue(randomVariableFalse)).to.equal(false)
      })
    })
    describe('OR', () => {
      it('should handle function rules resulting in true', () => {
        const allTrue = createAllTrue('OR', Function)
        expect(getFinalValue(allTrue)).to.equal(true)
        const oneTrue = createOneTrue('OR', Function)
        expect(getFinalValue(oneTrue)).to.equal(true)
        const oneFalse = createOneFalse('OR', Function)
        expect(getFinalValue(oneFalse)).to.equal(true)

      })
      it('should handle boolean rules resulting in true', () => {
        const allTrue = createAllTrue('OR', Boolean)
        expect(getFinalValue(allTrue)).to.equal(true)
        const oneTrue = createOneTrue('OR', Boolean)
        expect(getFinalValue(oneTrue)).to.equal(true)
        const oneFalse = createOneFalse('OR', Boolean)
        expect(getFinalValue(oneFalse)).to.equal(true)

      })
      it('should handle function rules resulting in false', () => {
        const allFalse = createAllFalse('OR', Function)
        expect(getFinalValue(allFalse)).to.equal(false)
      })
      it('should handle boolean rules resulting in false', () => {
        const allFalse = createAllFalse('OR', Boolean)
        expect(getFinalValue(allFalse)).to.equal(false)
      })
    })
    describe('XOR', () => {
      it('should handle function rules resulting in true', () => {
        const oneTrue = createOneTrue('XOR', Function)
        expect(getFinalValue(oneTrue)).to.equal(true)
      })
      it('should handle boolean rules resulting in true', () => {
        const oneTrue = createOneTrue('XOR', Boolean)
        expect(getFinalValue(oneTrue)).to.equal(true)
      })
      it('should handle function rules resulting in false', () => {
        const allTrue = createAllTrue('XOR', Function)
        expect(getFinalValue(allTrue)).to.equal(false)
        const allFalse = createAllFalse('XOR', Function)
        expect(getFinalValue(allFalse)).to.equal(false)
        const options = {
          functionTrue: randomFromRange(2, 5),
          functionFalse: randomFromRange(2, 5)
        }
        const twoOrMoreTrue = createVariableRules('XOR', options)
        expect(getFinalValue(twoOrMoreTrue)).to.equal(false)
      })
      it('should handle boolean rules resulting in false', () => {
        const allTrue = createAllTrue('XOR', Boolean)
        expect(getFinalValue(allTrue)).to.equal(false)
        const allFalse = createAllFalse('XOR', Boolean)
        expect(getFinalValue(allFalse)).to.equal(false)
        const options = {
          booleanTrue: randomFromRange(2, 5),
          booleanFalse: randomFromRange(2, 5)
        }
        const twoOrMoreTrue = createVariableRules('XOR', options)
        expect(getFinalValue(twoOrMoreTrue)).to.equal(false)
      })
    })
  })
  describe('complex rules', () => {
    let allTrue, nestedAllTrue, doubleNestedAllTrue, variable, exactlyOneTrueFunction, exactlyOneTrueBoolean, exactlyOneTrue
    describe('AND', () => {
      beforeEach(() => {
        allTrue = createVariableRules('AND', {
          functionTrue: randomFromRange(1, 10),
          booleanTrue: randomFromRange(1, 10),
          returnWrapper: true
        }).shuffle()
        nestedAllTrue = allTrue.clone()
          .addRules(allTrue.getRuleSet())
          .shuffle()
        doubleNestedAllTrue = allTrue.clone()
          .addRules(nestedAllTrue.getRuleSet())
          .addRules(allTrue.getRuleSet())
          .shuffle()
        allFalse = createVariableRules('AND', {
          functionFlase: randomFromRange(1, 10),
          booleanFalse: randomFromRange(1, 10),
          returnWrapper: true
        }).shuffle()
        nestedAllFalse = allFalse.clone()
          .addRules(allFalse.getRuleSet())
          .shuffle()
        doubleNestedAllFalse = allFalse.clone()
          .addRules(nestedAllFalse.getRuleSet())
          .addRules(allFalse.getRuleSet())
          .shuffle()
        variable = createVariableRules('AND', {
            functionTrue: randomFromRange(1, 10),
            booleanTrue: randomFromRange(1, 10),
            booleanFalse: randomFromRange(1, 10),
            functionFalse: randomFromRange(1, 10),
            returnWrapper: true
          }).shuffle()
      })
      it('should handle mixed and nested rules resulting in true', () => {
        expect(getFinalValue(allTrue.getRuleSet())).to.equal(true)
        expect(getFinalValue(nestedAllTrue.getRuleSet())).to.equal(true)
        expect(getFinalValue(doubleNestedAllTrue.getRuleSet())).to.equal(true)
      })
      it('should handle mixed and nested rules resulting in false', () => {
        expect(getFinalValue(allFalse.getRuleSet())).to.equal(false)
        expect(getFinalValue(nestedAllFalse.getRuleSet())).to.equal(false)
        expect(getFinalValue(doubleNestedAllFalse.getRuleSet())).to.equal(false)
        expect(getFinalValue(variable.getRuleSet())).to.equal(false)
        const trueBaseTrueNestedFalse = allTrue.clone()
          .addRules(variable.getRuleSet())
        expect(getFinalValue(trueBaseTrueNestedFalse.getRuleSet())).to.equal(false)
        const trueBaseWithDeeplyNestedFalse = allTrue.clone()
          .addRules(trueBaseTrueNestedFalse.getRuleSet())
        expect(getFinalValue(trueBaseWithDeeplyNestedFalse.getRuleSet())).to.equal(false)
        
      })
    })
    describe('OR', () => {
      beforeEach(() => {
        allTrue = createVariableRules('OR', {
          functionTrue: randomFromRange(1, 10),
          booleanTrue: randomFromRange(1, 10),
          returnWrapper: true
        }).shuffle()
        nestedAllTrue = allTrue.clone()
          .addRules(allTrue.getRuleSet())
          .shuffle()
        doubleNestedAllTrue = allTrue.clone()
          .addRules(nestedAllTrue.getRuleSet())
          .addRules(allTrue.getRuleSet())
          .shuffle()
        allFalse = createVariableRules('OR', {
          functionFlase: randomFromRange(1, 10),
          booleanFalse: randomFromRange(1, 10),
          returnWrapper: true
        }).shuffle()
        nestedAllFalse = allFalse.clone()
          .addRules(allFalse.getRuleSet())
          .shuffle()
        doubleNestedAllFalse = allFalse.clone()
          .addRules(nestedAllFalse.getRuleSet())
          .addRules(allFalse.getRuleSet())
          .shuffle()
        variable = createVariableRules('OR', {
            functionTrue: randomFromRange(1, 10),
            booleanTrue: randomFromRange(1, 10),
            booleanFalse: randomFromRange(1, 10),
            functionFalse: randomFromRange(1, 10),
            returnWrapper: true
          }).shuffle()
      })
      it('should handle mixed and nested rules resulting in true', () => {
        expect(getFinalValue(allTrue.getRuleSet())).to.equal(true)
        expect(getFinalValue(nestedAllTrue.getRuleSet())).to.equal(true)
        expect(getFinalValue(doubleNestedAllTrue.getRuleSet())).to.equal(true)
        expect(getFinalValue(variable.getRuleSet())).to.equal(true)
        const falseBaseNestedTrue = allFalse.clone()
          .addRules(variable.getRuleSet())
        expect(getFinalValue(falseBaseNestedTrue.getRuleSet())).to.equal(true)
        const falseBaseWithDeeplyNestedTrue = allFalse.clone()
          .addRules(falseBaseNestedTrue.getRuleSet())
        
      })
      it('should handle mixed and nested rules resulting in false', () => {
        expect(getFinalValue(allFalse.getRuleSet())).to.equal(false)
        expect(getFinalValue(nestedAllFalse.getRuleSet())).to.equal(false)
        expect(getFinalValue(doubleNestedAllFalse.getRuleSet())).to.equal(false)
      })
    })
    describe('XOR', () => {
      beforeEach(() => {
        exactlyOneTrueFunction = createVariableRules('XOR', {
          functionTrue: 1,
          functionFalse: randomFromRange(1, 10),
          booleanFalse: randomFromRange(1, 10),
          returnWrapper: true
        }).shuffle()
        exactlyOneTrueBoolean = createVariableRules('XOR', {
          functionFalse: randomFromRange(1, 10),
          booleanTrue: 1,
          booleanFalse: randomFromRange(1, 10),
          returnWrapper: true
        }).shuffle()
        exactlyOneTrue = (() => {
          const whichIsTrue = Math.random() < 0.5 ? 'boolean' : 'function'
          return createVariableRules('XOR', {
            functionFalse: randomFromRange(1, 10),
            [`${whichIsTrue}True`]: 1,
            booleanFalse: randomFromRange(1, 10),
            returnWrapper: true
          }).shuffle()
        })()
        allTrue = createVariableRules('XOR', {
          functionTrue: randomFromRange(1, 10),
          booleanTrue: randomFromRange(1, 10),
          returnWrapper: true
        }).shuffle()
        nestedAllTrue = allTrue.clone()
          .addRules(allTrue.getRuleSet())
          .shuffle()
        doubleNestedAllTrue = allTrue.clone()
          .addRules(nestedAllTrue.getRuleSet())
          .addRules(allTrue.getRuleSet())
          .shuffle()
        allFalse = createVariableRules('XOR', {
          functionFlase: randomFromRange(1, 10),
          booleanFalse: randomFromRange(1, 10),
          returnWrapper: true
        }).shuffle()
        nestedAllFalse = allFalse.clone()
          .addRules(allFalse.getRuleSet())
          .shuffle()
        doubleNestedAllFalse = allFalse.clone()
          .addRules(nestedAllFalse.getRuleSet())
          .addRules(allFalse.getRuleSet())
          .shuffle()
        variable = createVariableRules('XOR', {
            functionTrue: randomFromRange(1, 10),
            booleanTrue: randomFromRange(1, 10),
            booleanFalse: randomFromRange(1, 10),
            functionFalse: randomFromRange(1, 10),
            returnWrapper: true
          }).shuffle()
      })
      it('should handle mixed and nested rules resulting in true', () => {
        expect(getFinalValue(exactlyOneTrueFunction.getRuleSet())).to.equal(true)
        expect(getFinalValue(exactlyOneTrueBoolean.getRuleSet())).to.equal(true)
        expect(getFinalValue(exactlyOneTrue.getRuleSet())).to.equal(true)
        const allFalseNestedOneTrue = allFalse.clone()
          .addRules(exactlyOneTrue.getRuleSet())
        expect(getFinalValue(allFalseNestedOneTrue.getRuleSet())).to.equal(true)
        const allFalseDeeplyNestedOneTrue = allFalse.clone()
          .addRules(allFalseNestedOneTrue.getRuleSet())
        expect(getFinalValue(allFalseDeeplyNestedOneTrue.getRuleSet())).to.equal(true)
      })
      it('should handle mixed and nested rules resulting in false', () => {
        expect(getFinalValue(allTrue.getRuleSet())).to.equal(false)
        expect(getFinalValue(nestedAllTrue.getRuleSet())).to.equal(false)
        expect(getFinalValue(doubleNestedAllTrue.getRuleSet())).to.equal(false)
        expect(getFinalValue(allFalse.getRuleSet())).to.equal(false)
        expect(getFinalValue(nestedAllFalse.getRuleSet())).to.equal(false)
        expect(getFinalValue(doubleNestedAllFalse.getRuleSet())).to.equal(false)
        expect(getFinalValue(variable.getRuleSet())).to.equal(false)
        const allFalseTwoNestedTrues = allFalse.clone()
          .addRules(exactlyOneTrue.getRuleSet())
          .addRules(exactlyOneTrue.getRuleSet())
        expect(getFinalValue(variable.getRuleSet())).to.equal(false)
      })
    })
    describe('Mixed rules', () => {
      beforeEach(() => {
        allTrue = createVariableRules('AND', {
          functionTrue: randomFromRange(1, 10),
          booleanTrue: randomFromRange(1, 10),
          returnWrapper: true
        }).shuffle()
        nestedAllTrue = allTrue.clone()
          .addRules(allTrue.getRuleSet())
          .shuffle()
        doubleNestedAllTrue = allTrue.clone()
          .addRules(nestedAllTrue.getRuleSet())
          .addRules(allTrue.getRuleSet())
          .shuffle()
        allFalse = createVariableRules('AND', {
          functionFlase: randomFromRange(1, 10),
          booleanFalse: randomFromRange(1, 10),
          returnWrapper: true
        }).shuffle()
        nestedAllFalse = allFalse.clone()
          .addRules(allFalse.getRuleSet())
          .shuffle()
        doubleNestedAllFalse = allFalse.clone()
          .addRules(nestedAllFalse.getRuleSet())
          .addRules(allFalse.getRuleSet())
          .shuffle()
        variable = createVariableRules('AND', {
            functionTrue: randomFromRange(1, 10),
            booleanTrue: randomFromRange(1, 10),
            booleanFalse: randomFromRange(1, 10),
            functionFalse: randomFromRange(1, 10),
            returnWrapper: true
          }).shuffle()
      })
      describe('(A && B) || C', () => {
        const createRule = (A, B, C) => {
          const AandB = createVariableRules('AND', { rules: [A, B] })
          return createVariableRules('OR', { rules: [AandB, C] })
        }
        it('should be true for A=true, B=true, c=true', () => {
          const A = allTrue.getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allTrue.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(true)
        })
        it('should be true for A=true, B=true, c=false', () => {
          const A = allTrue.getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(true)
        })
        it('should be true for A=false, B=true, c=true', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allTrue.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(true)
        })
        it('should be false for A=false, B=true, c=false', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(false)
        })
        it('should be false for A=false, B=false, c=false', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allFalse.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(false)
        })
      })
      describe('A && (B || C)', () => {
        const createRule = (A, B, C) => {
          const BorC = createVariableRules('OR', { rules: [B, C] })
          return createVariableRules('AND', { rules: [A, BorC] })
        }
        it('should be true for A=true, B=true, c=true', () => {
          const A = allTrue.getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allTrue.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(true)
        })
        it('should be true for A=true, B=true, c=false', () => {
          const A = allTrue.getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(true)
        })
        it('should be false for A=false, B=true, c=true', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allTrue.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(false)
        })
        it('should be false for A=false, B=true, c=false', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(false)
        })
        it('should be false for A=true, B=false, c=false', () => {
          const A = allTrue.clone().getRuleSet()
          const B = allFalse.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(false)
        })
      })
      describe('(A && B) ^ C', () => {
        const createRule = (A, B, C) => {
          const AandB = createVariableRules('AND', { rules: [A, B] })
          return createVariableRules('XOR', { rules: [AandB, C] })
        }
        it('should be false for A=true, B=true, c=true', () => {
          const A = allTrue.getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allTrue.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(false)
        })
        it('should be true for A=true, B=true, c=false', () => {
          const A = allTrue.getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(true)
        })
        it('should be true for A=false, B=true, c=true', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allTrue.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(true)
        })
        it('should be false for A=false, B=true, c=false', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(false)
        })
        it('should be false for A=true, B=false, c=false', () => {
          const A = allTrue.clone().getRuleSet()
          const B = allFalse.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(false)
        })
      })
      describe('A && (B ^ C)', () => {
        const createRule = (A, B, C) => {
          const BxorC = createVariableRules('XOR', { rules: [B, C] })
          return createVariableRules('AND', { rules: [A, BxorC] })
        }
        it('should be false for A=true, B=true, c=true', () => {
          const A = allTrue.getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allTrue.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(false)
        })
        it('should be true for A=true, B=true, c=false', () => {
          const A = allTrue.getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(true)
        })
        it('should be true for A=false, B=true, c=true', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allTrue.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(false)
        })
        it('should be false for A=false, B=true, c=false', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(false)
        })
        it('should be false for A=true, B=false, c=false', () => {
          const A = allTrue.clone().getRuleSet()
          const B = allFalse.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalValue(ruleSet)).to.equal(false)
        })
      })
    })
  })
})