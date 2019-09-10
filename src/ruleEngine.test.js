const chai = require('chai')
const ruleEngine = require('./ruleEngine')
const testRules = require('./testdata')

const { expect } = chai
const { createAllTrue, createAllFalse, createOneTrue, 
        createOneFalse, createVariableRules, randomFromRange } = testRules

describe('rules', () => {
  describe('basic', () => {
    it('should be a function', () => {
      expect(typeof ruleEngine).to.equal('function')
    })
    describe('AND', () => {
      it('should handle function rules resulting in true', () => {
        const allTrue = createAllTrue('AND', Function)
        expect(ruleEngine(allTrue)).to.equal(true)
        const randomAllTrue = createAllTrue('AND', Function, randomFromRange(1, 10))
        expect(ruleEngine(randomAllTrue)).to.equal(true)
      })
      it('should handle boolean rules resulting in true', () => {
        const allTrue = createAllTrue('AND', Boolean)
        expect(ruleEngine(allTrue)).to.equal(true)
        const randomAllTrue = createAllTrue('AND', Boolean, randomFromRange(1, 10))
        expect(ruleEngine(randomAllTrue)).to.equal(true)
      })
      it('should handle function rules resulting in false', () => {
        const allFalse = createAllFalse('AND', Function)
        expect(ruleEngine(allFalse)).to.equal(false)
        const oneFalse = createOneFalse('AND', Function)
        expect(ruleEngine(oneFalse)).to.equal(false)
        const randomOneFalse = createOneFalse('AND', Function, randomFromRange(1, 10))
        expect(ruleEngine(randomOneFalse)).to.equal(false)
        const options = {
          functionTrue: randomFromRange(0, 10),
          functionFalse: randomFromRange(1, 10)
        }
        const randomVariableFalse = createVariableRules('AND', options)
        expect(ruleEngine(randomVariableFalse)).to.equal(false)
      })
      it('should handle boolean rules resulting in false', () => {
        const allFalse = createAllFalse('AND', Boolean)
        expect(ruleEngine(allFalse)).to.equal(false)
        const oneFalse = createOneFalse('AND', Boolean)
        expect(ruleEngine(oneFalse)).to.equal(false)
        const randomOneFalse = createOneFalse('AND', Boolean, randomFromRange(1, 10))
        expect(ruleEngine(randomOneFalse)).to.equal(false)
        const options = {
          functionTrue: randomFromRange(0, 10),
          functionFalse: randomFromRange(1, 10)
        }
        const randomVariableFalse = createVariableRules('AND', options)
        expect(ruleEngine(randomVariableFalse)).to.equal(false)
      })
    })
    describe('OR', () => {
      it('should handle function rules resulting in true', () => {
        const allTrue = createAllTrue('OR', Function)
        expect(ruleEngine(allTrue)).to.equal(true)
        const oneTrue = createOneTrue('OR', Function)
        expect(ruleEngine(oneTrue)).to.equal(true)
        const oneFalse = createOneFalse('OR', Function)
        expect(ruleEngine(oneFalse)).to.equal(true)

      })
      it('should handle boolean rules resulting in true', () => {
        const allTrue = createAllTrue('OR', Boolean)
        expect(ruleEngine(allTrue)).to.equal(true)
        const oneTrue = createOneTrue('OR', Boolean)
        expect(ruleEngine(oneTrue)).to.equal(true)
        const oneFalse = createOneFalse('OR', Boolean)
        expect(ruleEngine(oneFalse)).to.equal(true)

      })
      it('should handle function rules resulting in false', () => {
        const allFalse = createAllFalse('OR', Function)
        expect(ruleEngine(allFalse)).to.equal(false)
      })
      it('should handle boolean rules resulting in false', () => {
        const allFalse = createAllFalse('OR', Boolean)
        expect(ruleEngine(allFalse)).to.equal(false)
      })
    })
    describe('XOR', () => {
      it('should handle function rules resulting in true', () => {
        const oneTrue = createOneTrue('XOR', Function)
        expect(ruleEngine(oneTrue)).to.equal(true)
      })
      it('should handle boolean rules resulting in true', () => {
        const oneTrue = createOneTrue('XOR', Boolean)
        expect(ruleEngine(oneTrue)).to.equal(true)
      })
      it('should handle function rules resulting in false', () => {
        const allTrue = createAllTrue('XOR', Function)
        expect(ruleEngine(allTrue)).to.equal(false)
        const allFalse = createAllFalse('XOR', Function)
        expect(ruleEngine(allFalse)).to.equal(false)
        const options = {
          functionTrue: randomFromRange(2, 5),
          functionFalse: randomFromRange(2, 5)
        }
        const twoOrMoreTrue = createVariableRules('XOR', options)
        expect(ruleEngine(twoOrMoreTrue)).to.equal(false)
      })
      it('should handle boolean rules resulting in false', () => {
        const allTrue = createAllTrue('XOR', Boolean)
        expect(ruleEngine(allTrue)).to.equal(false)
        const allFalse = createAllFalse('XOR', Boolean)
        expect(ruleEngine(allFalse)).to.equal(false)
        const options = {
          booleanTrue: randomFromRange(2, 5),
          booleanFalse: randomFromRange(2, 5)
        }
        const twoOrMoreTrue = createVariableRules('XOR', options)
        expect(ruleEngine(twoOrMoreTrue)).to.equal(false)
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
        expect(ruleEngine(allTrue.getRuleSet())).to.equal(true)
        expect(ruleEngine(nestedAllTrue.getRuleSet())).to.equal(true)
        expect(ruleEngine(doubleNestedAllTrue.getRuleSet())).to.equal(true)
      })
      it('should handle mixed and nested rules resulting in false', () => {
        expect(ruleEngine(allFalse.getRuleSet())).to.equal(false)
        expect(ruleEngine(nestedAllFalse.getRuleSet())).to.equal(false)
        expect(ruleEngine(doubleNestedAllFalse.getRuleSet())).to.equal(false)
        expect(ruleEngine(variable.getRuleSet())).to.equal(false)
        const trueBaseTrueNestedFalse = allTrue.clone()
          .addRules(variable.getRuleSet())
        expect(ruleEngine(trueBaseTrueNestedFalse.getRuleSet())).to.equal(false)
        const trueBaseWithDeeplyNestedFalse = allTrue.clone()
          .addRules(trueBaseTrueNestedFalse.getRuleSet())
        expect(ruleEngine(trueBaseWithDeeplyNestedFalse.getRuleSet())).to.equal(false)
        
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
        expect(ruleEngine(allTrue.getRuleSet())).to.equal(true)
        expect(ruleEngine(nestedAllTrue.getRuleSet())).to.equal(true)
        expect(ruleEngine(doubleNestedAllTrue.getRuleSet())).to.equal(true)
        expect(ruleEngine(variable.getRuleSet())).to.equal(true)
        const falseBaseNestedTrue = allFalse.clone()
          .addRules(variable.getRuleSet())
        expect(ruleEngine(falseBaseNestedTrue.getRuleSet())).to.equal(true)
        const falseBaseWithDeeplyNestedTrue = allFalse.clone()
          .addRules(falseBaseNestedTrue.getRuleSet())
        
      })
      it('should handle mixed and nested rules resulting in false', () => {
        expect(ruleEngine(allFalse.getRuleSet())).to.equal(false)
        expect(ruleEngine(nestedAllFalse.getRuleSet())).to.equal(false)
        expect(ruleEngine(doubleNestedAllFalse.getRuleSet())).to.equal(false)
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
        expect(ruleEngine(exactlyOneTrueFunction.getRuleSet())).to.equal(true)
        expect(ruleEngine(exactlyOneTrueBoolean.getRuleSet())).to.equal(true)
        expect(ruleEngine(exactlyOneTrue.getRuleSet())).to.equal(true)
        const allFalseNestedOneTrue = allFalse.clone()
          .addRules(exactlyOneTrue.getRuleSet())
        expect(ruleEngine(allFalseNestedOneTrue.getRuleSet())).to.equal(true)
        const allFalseDeeplyNestedOneTrue = allFalse.clone()
          .addRules(allFalseNestedOneTrue.getRuleSet())
        expect(ruleEngine(allFalseDeeplyNestedOneTrue.getRuleSet())).to.equal(true)
      })
      it('should handle mixed and nested rules resulting in false', () => {
        expect(ruleEngine(allTrue.getRuleSet())).to.equal(false)
        expect(ruleEngine(nestedAllTrue.getRuleSet())).to.equal(false)
        expect(ruleEngine(doubleNestedAllTrue.getRuleSet())).to.equal(false)
        expect(ruleEngine(allFalse.getRuleSet())).to.equal(false)
        expect(ruleEngine(nestedAllFalse.getRuleSet())).to.equal(false)
        expect(ruleEngine(doubleNestedAllFalse.getRuleSet())).to.equal(false)
        expect(ruleEngine(variable.getRuleSet())).to.equal(false)
        const allFalseTwoNestedTrues = allFalse.clone()
          .addRules(exactlyOneTrue.getRuleSet())
          .addRules(exactlyOneTrue.getRuleSet())
        expect(ruleEngine(variable.getRuleSet())).to.equal(false)
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
          expect(ruleEngine(ruleSet)).to.equal(true)
        })
        it('should be true for A=true, B=true, c=false', () => {
          const A = allTrue.getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(ruleEngine(ruleSet)).to.equal(true)
        })
        it('should be true for A=false, B=true, c=true', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allTrue.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(ruleEngine(ruleSet)).to.equal(true)
        })
        it('should be false for A=false, B=true, c=false', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(ruleEngine(ruleSet)).to.equal(false)
        })
        it('should be false for A=false, B=false, c=false', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allFalse.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(ruleEngine(ruleSet)).to.equal(false)
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
          expect(ruleEngine(ruleSet)).to.equal(true)
        })
        it('should be true for A=true, B=true, c=false', () => {
          const A = allTrue.getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(ruleEngine(ruleSet)).to.equal(true)
        })
        it('should be false for A=false, B=true, c=true', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allTrue.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(ruleEngine(ruleSet)).to.equal(false)
        })
        it('should be false for A=false, B=true, c=false', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(ruleEngine(ruleSet)).to.equal(false)
        })
        it('should be false for A=true, B=false, c=false', () => {
          const A = allTrue.clone().getRuleSet()
          const B = allFalse.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(ruleEngine(ruleSet)).to.equal(false)
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
          expect(ruleEngine(ruleSet)).to.equal(false)
        })
        it('should be true for A=true, B=true, c=false', () => {
          const A = allTrue.getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(ruleEngine(ruleSet)).to.equal(true)
        })
        it('should be true for A=false, B=true, c=true', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allTrue.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(ruleEngine(ruleSet)).to.equal(true)
        })
        it('should be false for A=false, B=true, c=false', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(ruleEngine(ruleSet)).to.equal(false)
        })
        it('should be false for A=true, B=false, c=false', () => {
          const A = allTrue.clone().getRuleSet()
          const B = allFalse.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(ruleEngine(ruleSet)).to.equal(false)
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
          expect(ruleEngine(ruleSet)).to.equal(false)
        })
        it('should be true for A=true, B=true, c=false', () => {
          const A = allTrue.getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(ruleEngine(ruleSet)).to.equal(true)
        })
        it('should be true for A=false, B=true, c=true', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allTrue.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(ruleEngine(ruleSet)).to.equal(false)
        })
        it('should be false for A=false, B=true, c=false', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(ruleEngine(ruleSet)).to.equal(false)
        })
        it('should be false for A=true, B=false, c=false', () => {
          const A = allTrue.clone().getRuleSet()
          const B = allFalse.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(ruleEngine(ruleSet)).to.equal(false)
        })
      })
    })
  })
})