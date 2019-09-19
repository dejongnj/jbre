const chai = require('chai')
const ruleEngine = require('./ruleEngine')
const testRules = require('./testdata')
const { AND, XOR, OR } = require('./constants/ruleTypes')
const { expect } = chai
const { createAllTrue, createAllFalse, createOneTrue, createRuleSet,
        createOneFalse, createVariableRules, randomFromRange } = testRules

describe('rules', () => {
  const getFinalResult = rulesObject => {
    const ruleTree = ruleEngine(rulesObject)
    return ruleTree.root.value
  }
  describe('basic', () => {
    it('should be a function', () => {
      expect(typeof ruleEngine).to.equal('function')
    })
    describe('AND', () => {
      it('should handle function rules resulting in true', () => {
        const allTrue = createAllTrue('AND', Function)
        expect(getFinalResult(allTrue)).to.equal(true)
        const randomAllTrue = createAllTrue('AND', Function, randomFromRange(1, 10))
        expect(getFinalResult(randomAllTrue)).to.equal(true)
      })
      it('should handle boolean rules resulting in true', () => {
        const allTrue = createAllTrue('AND', Boolean)
        expect(getFinalResult(allTrue)).to.equal(true)
        const randomAllTrue = createAllTrue('AND', Boolean, randomFromRange(1, 10))
        expect(getFinalResult(randomAllTrue)).to.equal(true)
      })
      it('should handle function rules resulting in false', () => {
        const allFalse = createAllFalse('AND', Function)
        expect(getFinalResult(allFalse)).to.equal(false)
        const oneFalse = createOneFalse('AND', Function)
        expect(getFinalResult(oneFalse)).to.equal(false)
        const randomOneFalse = createOneFalse('AND', Function, randomFromRange(1, 10))
        expect(getFinalResult(randomOneFalse)).to.equal(false)
        const options = {
          functionTrue: randomFromRange(0, 10),
          functionFalse: randomFromRange(1, 10)
        }
        const randomVariableFalse = createVariableRules('AND', options)
        expect(getFinalResult(randomVariableFalse)).to.equal(false)
      })
      it('should handle boolean rules resulting in false', () => {
        const allFalse = createAllFalse('AND', Boolean)
        expect(getFinalResult(allFalse)).to.equal(false)
        const oneFalse = createOneFalse('AND', Boolean)
        expect(getFinalResult(oneFalse)).to.equal(false)
        const randomOneFalse = createOneFalse('AND', Boolean, randomFromRange(1, 10))
        expect(getFinalResult(randomOneFalse)).to.equal(false)
        const options = {
          functionTrue: randomFromRange(0, 10),
          functionFalse: randomFromRange(1, 10)
        }
        const randomVariableFalse = createVariableRules('AND', options)
        expect(getFinalResult(randomVariableFalse)).to.equal(false)
      })
    })
    describe('OR', () => {
      it('should handle function rules resulting in true', () => {
        const allTrue = createAllTrue('OR', Function)
        expect(getFinalResult(allTrue)).to.equal(true)
        const oneTrue = createOneTrue('OR', Function)
        expect(getFinalResult(oneTrue)).to.equal(true)
        const oneFalse = createOneFalse('OR', Function)
        expect(getFinalResult(oneFalse)).to.equal(true)

      })
      it('should handle boolean rules resulting in true', () => {
        const allTrue = createAllTrue('OR', Boolean)
        expect(getFinalResult(allTrue)).to.equal(true)
        const oneTrue = createOneTrue('OR', Boolean)
        expect(getFinalResult(oneTrue)).to.equal(true)
        const oneFalse = createOneFalse('OR', Boolean)
        expect(getFinalResult(oneFalse)).to.equal(true)

      })
      it('should handle function rules resulting in false', () => {
        const allFalse = createAllFalse('OR', Function)
        expect(getFinalResult(allFalse)).to.equal(false)
      })
      it('should handle boolean rules resulting in false', () => {
        const allFalse = createAllFalse('OR', Boolean)
        expect(getFinalResult(allFalse)).to.equal(false)
      })
    })
    describe('XOR', () => {
      it('should handle function rules resulting in true', () => {
        const oneTrue = createOneTrue('XOR', Function)
        expect(getFinalResult(oneTrue)).to.equal(true)
      })
      it('should handle boolean rules resulting in true', () => {
        const oneTrue = createOneTrue('XOR', Boolean)
        expect(getFinalResult(oneTrue)).to.equal(true)
      })
      it('should handle function rules resulting in false', () => {
        const allTrue = createAllTrue('XOR', Function)
        expect(getFinalResult(allTrue)).to.equal(false)
        const allFalse = createAllFalse('XOR', Function)
        expect(getFinalResult(allFalse)).to.equal(false)
        const options = {
          functionTrue: randomFromRange(2, 5),
          functionFalse: randomFromRange(2, 5)
        }
        const twoOrMoreTrue = createVariableRules('XOR', options)
        expect(getFinalResult(twoOrMoreTrue)).to.equal(false)
      })
      it('should handle boolean rules resulting in false', () => {
        const allTrue = createAllTrue('XOR', Boolean)
        expect(getFinalResult(allTrue)).to.equal(false)
        const allFalse = createAllFalse('XOR', Boolean)
        expect(getFinalResult(allFalse)).to.equal(false)
        const options = {
          booleanTrue: randomFromRange(2, 5),
          booleanFalse: randomFromRange(2, 5)
        }
        const twoOrMoreTrue = createVariableRules('XOR', options)
        expect(getFinalResult(twoOrMoreTrue)).to.equal(false)
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
        expect(getFinalResult(allTrue.getRuleSet())).to.equal(true)
        expect(getFinalResult(nestedAllTrue.getRuleSet())).to.equal(true)
        expect(getFinalResult(doubleNestedAllTrue.getRuleSet())).to.equal(true)
      })
      it('should handle mixed and nested rules resulting in false', () => {
        expect(getFinalResult(allFalse.getRuleSet())).to.equal(false)
        expect(getFinalResult(nestedAllFalse.getRuleSet())).to.equal(false)
        expect(getFinalResult(doubleNestedAllFalse.getRuleSet())).to.equal(false)
        expect(getFinalResult(variable.getRuleSet())).to.equal(false)
        const trueBaseTrueNestedFalse = allTrue.clone()
          .addRules(variable.getRuleSet())
        expect(getFinalResult(trueBaseTrueNestedFalse.getRuleSet())).to.equal(false)
        const trueBaseWithDeeplyNestedFalse = allTrue.clone()
          .addRules(trueBaseTrueNestedFalse.getRuleSet())
        expect(getFinalResult(trueBaseWithDeeplyNestedFalse.getRuleSet())).to.equal(false)
        
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
        expect(getFinalResult(allTrue.getRuleSet())).to.equal(true)
        expect(getFinalResult(nestedAllTrue.getRuleSet())).to.equal(true)
        expect(getFinalResult(doubleNestedAllTrue.getRuleSet())).to.equal(true)
        expect(getFinalResult(variable.getRuleSet())).to.equal(true)
        const falseBaseNestedTrue = allFalse.clone()
          .addRules(variable.getRuleSet())
        expect(getFinalResult(falseBaseNestedTrue.getRuleSet())).to.equal(true)
        const falseBaseWithDeeplyNestedTrue = allFalse.clone()
          .addRules(falseBaseNestedTrue.getRuleSet())
        
      })
      it('should handle mixed and nested rules resulting in false', () => {
        expect(getFinalResult(allFalse.getRuleSet())).to.equal(false)
        expect(getFinalResult(nestedAllFalse.getRuleSet())).to.equal(false)
        expect(getFinalResult(doubleNestedAllFalse.getRuleSet())).to.equal(false)
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
        expect(getFinalResult(exactlyOneTrueFunction.getRuleSet())).to.equal(true)
        expect(getFinalResult(exactlyOneTrueBoolean.getRuleSet())).to.equal(true)
        expect(getFinalResult(exactlyOneTrue.getRuleSet())).to.equal(true)
        const allFalseNestedOneTrue = allFalse.clone()
          .addRules(exactlyOneTrue.getRuleSet())
        expect(getFinalResult(allFalseNestedOneTrue.getRuleSet())).to.equal(true)
        const allFalseDeeplyNestedOneTrue = allFalse.clone()
          .addRules(allFalseNestedOneTrue.getRuleSet())
        expect(getFinalResult(allFalseDeeplyNestedOneTrue.getRuleSet())).to.equal(true)
      })
      it('should handle mixed and nested rules resulting in false', () => {
        expect(getFinalResult(allTrue.getRuleSet())).to.equal(false)
        expect(getFinalResult(nestedAllTrue.getRuleSet())).to.equal(false)
        expect(getFinalResult(doubleNestedAllTrue.getRuleSet())).to.equal(false)
        expect(getFinalResult(allFalse.getRuleSet())).to.equal(false)
        expect(getFinalResult(nestedAllFalse.getRuleSet())).to.equal(false)
        expect(getFinalResult(doubleNestedAllFalse.getRuleSet())).to.equal(false)
        expect(getFinalResult(variable.getRuleSet())).to.equal(false)
        const allFalseTwoNestedTrues = allFalse.clone()
          .addRules(exactlyOneTrue.getRuleSet())
          .addRules(exactlyOneTrue.getRuleSet())
        expect(getFinalResult(variable.getRuleSet())).to.equal(false)
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
          expect(getFinalResult(ruleSet)).to.equal(true)
        })
        it('should be true for A=true, B=true, c=false', () => {
          const A = allTrue.getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalResult(ruleSet)).to.equal(true)
        })
        it('should be true for A=false, B=true, c=true', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allTrue.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalResult(ruleSet)).to.equal(true)
        })
        it('should be false for A=false, B=true, c=false', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalResult(ruleSet)).to.equal(false)
        })
        it('should be false for A=false, B=false, c=false', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allFalse.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalResult(ruleSet)).to.equal(false)
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
          expect(getFinalResult(ruleSet)).to.equal(true)
        })
        it('should be true for A=true, B=true, c=false', () => {
          const A = allTrue.getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalResult(ruleSet)).to.equal(true)
        })
        it('should be false for A=false, B=true, c=true', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allTrue.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalResult(ruleSet)).to.equal(false)
        })
        it('should be false for A=false, B=true, c=false', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalResult(ruleSet)).to.equal(false)
        })
        it('should be false for A=true, B=false, c=false', () => {
          const A = allTrue.clone().getRuleSet()
          const B = allFalse.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalResult(ruleSet)).to.equal(false)
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
          expect(getFinalResult(ruleSet)).to.equal(false)
        })
        it('should be true for A=true, B=true, c=false', () => {
          const A = allTrue.getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalResult(ruleSet)).to.equal(true)
        })
        it('should be true for A=false, B=true, c=true', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allTrue.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalResult(ruleSet)).to.equal(true)
        })
        it('should be false for A=false, B=true, c=false', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalResult(ruleSet)).to.equal(false)
        })
        it('should be false for A=true, B=false, c=false', () => {
          const A = allTrue.clone().getRuleSet()
          const B = allFalse.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalResult(ruleSet)).to.equal(false)
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
          expect(getFinalResult(ruleSet)).to.equal(false)
        })
        it('should be true for A=true, B=true, c=false', () => {
          const A = allTrue.getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalResult(ruleSet)).to.equal(true)
        })
        it('should be true for A=false, B=true, c=true', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allTrue.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalResult(ruleSet)).to.equal(false)
        })
        it('should be false for A=false, B=true, c=false', () => {
          const A = allFalse.clone().getRuleSet()
          const B = allTrue.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalResult(ruleSet)).to.equal(false)
        })
        it('should be false for A=true, B=false, c=false', () => {
          const A = allTrue.clone().getRuleSet()
          const B = allFalse.clone().getRuleSet()
          const C = allFalse.clone().getRuleSet()
          const ruleSet = createRule(A, B, C)
          expect(getFinalResult(ruleSet)).to.equal(false)
        })
      })
    })
  })
})

describe('messages', () => {
  describe('basic error messages', () => {
    let ruleSet
    beforeEach(() => {
      ruleSet = createRuleSet()
      ruleSet.setType('AND')
    })
    describe('AND', () => {
      let ruleTree
      beforeEach(() => {
        ruleSet = {
          type: AND,
          rules: [
            () => true,
            (ruleNode) => {
              ruleNode.name = 'HELLO WORLD'
              ruleNode.message = 'XxXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
              return false
            },
            {
              type: OR,
              name: 'My test passing OR',
              rules: [() => true, () => false, () => false, true, true]
            },
            {
              type: OR,
              name: 'My test failing OR',
              rules: [() => false, () => false, () => false, false, false,
                {
                  type: XOR,
                  name: 'FAILING ALL FALSE XOR',
                  rules: [false, false, false]
                },
                {
                  type: XOR,
                  name: 'FAILING MORE THAN ONE TRUE XOR',
                  rules: [true, true, false],
                },
              ]
            },
            {
              type: XOR,
              name: 'PASSING XOR---',
              rules: [()=> false, true, false, false],
            },
          ]
        }
        // ruleTree = ruleEngine(ruleSet)
      })
      it('does something', () => {
        // console.log(ruleTree.root.result)
        // console.log(util.inspect(ruleTree.errors.analyze(), false, null, true))
        // console.log(ruleTree.root.evaluate(ruleTree.root))
      })
      it('does something simple rule', () => {
        ruleSet = {
          type: AND,
          rules: [
            (ruleNode) => {
              ruleNode.name = 'HELLO WORLD'
              ruleNode.message = 'XxXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
              return false
            },
            true
          ]
        }
        ruleTree = ruleEngine(ruleSet)
        console.log('===========================')
        console.log(ruleTree.getAnalysis())
      })
    })
  })
})