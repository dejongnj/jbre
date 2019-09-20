const chai = require('chai')
const ruleEngine = require('../src/ruleEngine')
const testRules = require('./testdata')
const { AND, NAND, OR, NOR, XOR, NXOR, EXACTLY_ONE, TERMINAL } = require('../src/constants/ruleTypes')
const { expect } = chai
const { createAllTrue, createAllFalse, createOneTrue, createRuleSet,
        createOneFalse, createVariableRules, randomFromRange } = testRules

describe('rules', () => {
  const getFinalResult = rulesObject => {
    const ruleTree = ruleEngine(rulesObject)
    return ruleTree.root.value
  }
  const getEvenComplement = (num, min, max) => {
    let evenComplement = randomFromRange(min, max)
    while ((evenComplement + num) % 2) {
      evenComplement = randomFromRange(min, max)
    }
    return evenComplement
  }
  const getOddComplement = (num, min, max) => {
    let getOddComplement = randomFromRange(min, max)
    while ((getOddComplement + num) % 2 !== 1) {
      getOddComplement = randomFromRange(min, max)
    }
    return getOddComplement
  }
  describe('basic', () => {
    it('should be a function', () => {
      expect(typeof ruleEngine).to.equal('function')
    })
    ;[AND, NAND].forEach(type => {
      let result
      beforeEach(() => {
        result = type === AND
      })
      describe(`${type} basic type results`, () => {
        it('should handle function rules resulting in true', () => {
          const allTrue = createAllTrue(type, Function)
          expect(getFinalResult(allTrue)).to.equal(result)
          const randomAllTrue = createAllTrue(type, Function, randomFromRange(1, 10))
          expect(getFinalResult(randomAllTrue)).to.equal(result)
        })
        it('should handle boolean rules resulting in true', () => {
          const result = type === AND          
          const allTrue = createAllTrue(type, Boolean)
          expect(getFinalResult(allTrue)).to.equal(result)
          const randomAllTrue = createAllTrue(type, Boolean, randomFromRange(1, 10))
          expect(getFinalResult(randomAllTrue)).to.equal(result)
        })
        it('should handle function rules resulting in false', () => {
          const allFalse = createAllFalse(type, Function)
          expect(getFinalResult(allFalse)).to.equal(!result)
          const oneFalse = createOneFalse(type, Function)
          expect(getFinalResult(oneFalse)).to.equal(!result)
          const randomOneFalse = createOneFalse(type, Function, randomFromRange(1, 10))
          expect(getFinalResult(randomOneFalse)).to.equal(!result)
          const options = {
            functionTrue: randomFromRange(0, 10),
            functionFalse: randomFromRange(1, 10)
          }
          const randomVariableFalse = createVariableRules(type, options)
          expect(getFinalResult(randomVariableFalse)).to.equal(!result)
        })
        it('should handle boolean rules resulting in false', () => {
          const allFalse = createAllFalse(type, Boolean)
          expect(getFinalResult(allFalse)).to.equal(!result)
          const oneFalse = createOneFalse(type, Boolean)
          expect(getFinalResult(oneFalse)).to.equal(!result)
          const randomOneFalse = createOneFalse(type, Boolean, randomFromRange(1, 10))
          expect(getFinalResult(randomOneFalse)).to.equal(!result)
          const options = {
            functionTrue: randomFromRange(0, 10),
            functionFalse: randomFromRange(1, 10)
          }
          const randomVariableFalse = createVariableRules(type, options)
          expect(getFinalResult(randomVariableFalse)).to.equal(!result)
        })
      })
    })
    
    ;[OR, NOR].forEach(type => {
      let result
      beforeEach(() => {
        result = type === OR
      })
      describe(`${type} basic type results`, () => {
        it('should handle function rules resulting in true', () => {
          const allTrue = createAllTrue(type, Function)
          expect(getFinalResult(allTrue)).to.equal(result)
          const oneTrue = createOneTrue(type, Function)
          expect(getFinalResult(oneTrue)).to.equal(result)
          const oneFalse = createOneFalse(type, Function)
          expect(getFinalResult(oneFalse)).to.equal(result)
  
        })
        it('should handle boolean rules resulting in true', () => {       
          const allTrue = createAllTrue(type, Boolean)
          expect(getFinalResult(allTrue)).to.equal(result)
          const oneTrue = createOneTrue(type, Boolean)
          expect(getFinalResult(oneTrue)).to.equal(result)
          const oneFalse = createOneFalse(type, Boolean)
          expect(getFinalResult(oneFalse)).to.equal(result)
  
        })
        it('should handle function rules resulting in false', () => {   
          const allFalse = createAllFalse(type, Function)
          expect(getFinalResult(allFalse)).to.equal(!result)
        })
        it('should handle boolean rules resulting in false', () => {                         
          const allFalse = createAllFalse(type, Boolean)
          expect(getFinalResult(allFalse)).to.equal(!result)
        })
      })
    })
    
    ;[XOR, NXOR].forEach(type => {
      describe(`${type} basic type results`, () => {
        let result
        beforeEach(() => {
          result = type === XOR
        })
        it('should handle function rules resulting in true', () => {
          const oneTrue = createOneTrue(type, Function)
          expect(getFinalResult(oneTrue)).to.equal(result)
        })
        it('should handle boolean rules resulting in true', () => {
          const oneTrue = createOneTrue(type, Boolean)
          expect(getFinalResult(oneTrue)).to.equal(result)
        })
        it('should handle function rules resulting in false', () => {
          const allTrue = createAllTrue(type, Function, getEvenComplement(0, 2, 10))
          expect(getFinalResult(allTrue)).to.equal(!result)
          const allFalse = createAllFalse(type, Function)
          expect(getFinalResult(allFalse)).to.equal(!result)
          const options = {
            functionTrue: getEvenComplement(0, 2, 10),
            functionFalse: randomFromRange(2, 5)
          }
          const evenTrue = createVariableRules(type, options)
          expect(getFinalResult(evenTrue)).to.equal(!result)
        })
        it('should handle even number of boolean rules resulting in false', () => {
          const allTrue = createAllTrue(type, Boolean, 4)
          expect(getFinalResult(allTrue)).to.equal(!result)
          const allFalse = createAllFalse(type, Boolean)
          expect(getFinalResult(allFalse)).to.equal(!result)
  
          const options = {
            booleanTrue: getEvenComplement(0, 2, 10),
            booleanFalse: randomFromRange(2, 5)
          }
          const twoOrMoreTrue = createVariableRules(type, options,)
          expect(getFinalResult(twoOrMoreTrue)).to.equal(!result)
        })
        it('should handle odd number of boolean rules resulting in false', () => {
          const allTrue = createAllTrue(type, Boolean, 7)
          expect(getFinalResult(allTrue)).to.equal(result)
          const booleanTrue = getOddComplement(0, 1, 5)
          const options = {
            booleanTrue,
            booleanFalse: randomFromRange(2, 5)
          }
          const twoOrMoreTrue = createVariableRules(type, options)
          expect(getFinalResult(twoOrMoreTrue)).to.equal(result)
        })
      })
    })

    describe(`${EXACTLY_ONE} basic type results`, () => {
      it('should handle function rules resulting in true', () => {
        const oneTrue = createOneTrue(EXACTLY_ONE, Function)
        expect(getFinalResult(oneTrue)).to.equal(true)
      })
      it('should handle boolean rules resulting in true', () => {
        const oneTrue = createOneTrue(EXACTLY_ONE, Boolean)
        expect(getFinalResult(oneTrue)).to.equal(true)
      })
      it('should handle function rules resulting in false', () => {
        const allTrue = createAllTrue(EXACTLY_ONE, Function, randomFromRange(2, 5))
        expect(getFinalResult(allTrue)).to.equal(false)
        const allFalse = createAllFalse(EXACTLY_ONE, Function)
        expect(getFinalResult(allFalse)).to.equal(false)
        const options = {
          functionTrue: randomFromRange(2, 5),
          functionFalse: randomFromRange(2, 5)
        }
        const randomTrue = createVariableRules(EXACTLY_ONE, options)
        expect(getFinalResult(randomTrue)).to.equal(false)
      })
      it('should handle even number of boolean rules resulting in false', () => {
        const allTrue = createAllTrue(EXACTLY_ONE, Boolean, randomFromRange(2, 10))
        expect(getFinalResult(allTrue)).to.equal(false)
        const allFalse = createAllFalse(EXACTLY_ONE, Boolean)
        expect(getFinalResult(allFalse)).to.equal(false)

        const options = {
          booleanTrue: getEvenComplement(0, 2, 10),
          booleanFalse: randomFromRange(2, 5)
        }
        const twoOrMoreTrue = createVariableRules(EXACTLY_ONE, options,)
        expect(getFinalResult(twoOrMoreTrue)).to.equal(false)
      })
      it('should handle odd number of boolean rules resulting in false', () => {
        const allTrue = createAllTrue(EXACTLY_ONE, Boolean, 7)
        expect(getFinalResult(allTrue)).to.equal(false)
        const booleanTrue = randomFromRange(2, 10)
        const options = {
          booleanTrue,
          booleanFalse: randomFromRange(2, 5)
        }
        const twoOrMoreTrue = createVariableRules(EXACTLY_ONE, options)
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
      let evenAllTrue, nestedEvenAllTrue, oddAllTrue, nestedOddAllTrue
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
        evenAllTrue = (() => {
            const numberOfFunctions = randomFromRange(1, 10)
            return createVariableRules('XOR', {
            functionTrue: numberOfFunctions,
            booleanTrue: getEvenComplement(numberOfFunctions, 1, 10),
            returnWrapper: true
          }).shuffle()
        })()
        oddAllTrue = (() => {
            const numberOfFunctions = randomFromRange(1, 10)
            return createVariableRules('XOR', {
            functionTrue: numberOfFunctions,
            booleanTrue: getOddComplement(numberOfFunctions, 1, 10),
            returnWrapper: true
          }).shuffle()
        })()
        nestedEvenAllTrue = evenAllTrue.clone()
          .addRules(evenAllTrue.getRuleSet())
          .shuffle()
        nestedAllTrue = allTrue.clone()
          .addRules(allTrue.getRuleSet())
          .shuffle()
        nestedOddAllTrue = oddAllTrue.clone()
          .addRules(evenAllTrue.getRuleSet()) // nested object should give false so that base object still has odd number
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
        expect(getFinalResult(oddAllTrue.getRuleSet())).to.equal(true)
        expect(getFinalResult(nestedOddAllTrue.getRuleSet())).to.equal(true)
      })
      it('should handle mixed and nested rules resulting in false', () => {
        expect(getFinalResult(evenAllTrue.getRuleSet())).to.equal(false)
        expect(getFinalResult(nestedEvenAllTrue.getRuleSet())).to.equal(false)
        expect(getFinalResult(nestedAllFalse.getRuleSet())).to.equal(false)
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
      })
    })
  })
})