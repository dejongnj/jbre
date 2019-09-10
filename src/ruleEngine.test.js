const chai = require('chai')
const ruleEngine = require('./ruleEngine')
const testRules = require('./testdata')

const { expect } = chai
const { andRuleAllTrue, andRuleAllFalse, andRuleOneFalse, andRuleNestedAllTrue, andRuleNestedNestedFalse, andRuleNestedRootFalse,
        orRuleAllTrue, orRuleAllFalse, orRuleOneFalse,
        xorRuleAllTrue, xorRuleAllFalse, xorRuleOneTrue } = testRules

describe('rules', () => {
  describe('basic', () => {
    it('should be a function', () => {
      expect(typeof ruleEngine).to.equal('function')
    })
    describe('AND', () => {
      it('should handle and rules resulting in true', () => {
        expect(ruleEngine(andRuleAllTrue)).to.equal(true)
      })
      it('should handle and rules resulting in false', () => {
        expect(ruleEngine(andRuleAllFalse)).to.equal(false)
        expect(ruleEngine(andRuleOneFalse)).to.equal(false)
      })
    })
    describe('OR', () => {
      it('should handle OR rules resulting in true', () => {
        expect(ruleEngine(orRuleAllTrue)).to.equal(true)
        expect(ruleEngine(orRuleOneFalse)).to.equal(true)
      })
      it('should handle OR rules resulting in true', () => {
        expect(ruleEngine(orRuleAllFalse)).to.equal(false)
      })
    })
    describe('XOR', () => {
      it('should handle XOR rules resulting in true', () => {
        expect(ruleEngine(xorRuleOneTrue)).to.equal(true)
      })
      it('should handle OR rules resulting in true', () => {
        expect(ruleEngine(xorRuleAllTrue)).to.equal(false)
        expect(ruleEngine(xorRuleAllFalse)).to.equal(false)
      })
    })
  })
  describe('nested rules 1 level', () => {
    it('should be a function', () => {
      expect(typeof ruleEngine).to.equal('function')
    })
    describe('AND', () => {
      it('should handle and rules resulting in true', () => {
        expect(ruleEngine(andRuleNestedAllTrue)).to.equal(true)
      })
      it('should handle and rules resulting in false', () => {
        expect(ruleEngine(andRuleNestedNestedFalse)).to.equal(false)
        expect(ruleEngine(andRuleNestedRootFalse)).to.equal(false)
      })
    })
    // describe('OR', () => {
    //   it('should handle OR rules resulting in true', () => {
    //     expect(ruleEngine(orRuleAllTrue)).to.equal(true)
    //     expect(ruleEngine(orRuleOneFalse)).to.equal(true)
    //   })
    //   it('should handle OR rules resulting in true', () => {
    //     expect(ruleEngine(orRuleAllFalse)).to.equal(false)
    //   })
    // })
    // describe('XOR', () => {
    //   it('should handle XOR rules resulting in true', () => {
    //     expect(ruleEngine(xorRuleOneTrue)).to.equal(true)
    //   })
    //   it('should handle OR rules resulting in true', () => {
    //     expect(ruleEngine(xorRuleAllTrue)).to.equal(false)
    //     expect(ruleEngine(xorRuleAllFalse)).to.equal(false)
    //   })
    // })
  })
  
})