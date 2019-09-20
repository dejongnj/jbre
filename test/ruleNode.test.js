const chai = require('chai')
const RuleNode = require('../src/ruleTree/RuleNode')
const AnalysisNode = require('../src/ruleTree/analysisNode')
const { AND, OR, XOR, TERMINAL } = require('../src/constants/ruleTypes')
const { expect } = chai

const TEST_ID = 'TEST_ID'
const TEST_NAME = 'TEST_NAME'
const TEST_DESCRIPTION = 'TEST_DESCRIPTION'
const createRuleObject = (type, rules) => ({
    id: TEST_ID,
    name: TEST_NAME,
    description: TEST_DESCRIPTION,
    type,
    rules
  })

describe('RuleNode', () => {
  describe('TERMINAL rule', () => {
    describe('Boolean values', () => {
      [true, false].forEach(booleanRule => {
        it(`${String(booleanRule).toUpperCase()}: creates an appropriate rule for boolean ${booleanRule}`, () => {
          const ruleObject = booleanRule
          const ruleNode = new RuleNode(ruleObject)
          const {
            id, name, description, type,
            parent, rules, value, analysis,
            globalOptions, options, meta
          } = ruleNode
          expect(id).to.equal(`${TERMINAL}-boolean`)
          expect(name).to.equal(`${TERMINAL} rule`)
          expect(description).to.equal(`${TERMINAL}-boolean`)
          expect(type).to.equal(TERMINAL)
          expect(parent).to.equal(null)
          expect(globalOptions).to.deep.equal({})
          expect(options).to.deep.equal({})
          expect(meta).to.deep.equal({})
          expect(globalOptions).to.deep.equal({})
          expect(options).to.deep.equal({})
          expect(meta).to.deep.equal({})
          expect(rules).to.deep.equal([])
          expect(value).to.equal(ruleObject)
          expect(analysis instanceof AnalysisNode).to.equal(true)
          expect(analysis.id).to.equal(id)
          expect(analysis.name).to.equal(name)
          expect(analysis.description).to.equal(description)
          expect(analysis.type).to.equal(type)
          expect(analysis.value).to.equal(value)
          expect(analysis.rules).to.deep.equal([])
        })
      })
    })
    describe('Functions as values', () => {
      [() => true, () => false].forEach(functionRule => {
        it(`${String(functionRule()).toUpperCase()}: creates an appropriate rule for boolean ${functionRule()}`, () => {
          const ruleObject = functionRule
          const ruleNode = new RuleNode(ruleObject)
          const {
            id, name, description, type,
            parent, rules, value, analysis,
            globalOptions, options, meta
          } = ruleNode
          expect(id).to.equal(`${TERMINAL}-function`)
          expect(name).to.equal(`${TERMINAL} rule`)
          expect(description).to.equal(`${TERMINAL}-function`)
          expect(type).to.equal(TERMINAL)
          expect(parent).to.equal(null)
          expect(globalOptions).to.deep.equal({})
          expect(options).to.deep.equal({})
          expect(meta).to.deep.equal({})
          expect(rules).to.deep.equal([])
          expect(value).to.equal(ruleObject(ruleNode))
          expect(analysis instanceof AnalysisNode).to.equal(true)
          expect(analysis.id).to.equal(id)
          expect(analysis.name).to.equal(name)
          expect(analysis.description).to.equal(description)
          expect(analysis.type).to.equal(type)
          expect(analysis.value).to.equal(value)
          expect(analysis.rules).to.deep.equal([])
        })
      })
    })
    describe('Object TERMINAL rules as values', () => {
      describe('boolean as evaluate property', () => {
        [true, false].forEach(booleanRule => {
          let terminalObject = {
            type: TERMINAL,
            evaluate: booleanRule
          }
          it(`${String(booleanRule).toUpperCase()}: creates an appropriate rule for boolean evaluate prop on TERMINAL object`, () => {
            const ruleObject = terminalObject
            const ruleNode = new RuleNode(ruleObject)
            const {
              id, name, description, type,
              parent, rules, value, analysis,
              globalOptions, options, meta
            } = ruleNode
            expect(id).to.equal(`TERMINAL-no-name-provided`)
            expect(name).to.equal(`${TERMINAL} rule`)
            expect(description).to.equal(``)
            expect(type).to.equal(TERMINAL)
            expect(parent).to.equal(null)
            expect(globalOptions).to.deep.equal({})
            expect(options).to.deep.equal({})
            expect(meta).to.deep.equal({})
            expect(globalOptions).to.deep.equal({})
            expect(options).to.deep.equal({})
            expect(meta).to.deep.equal({})
            expect(rules).to.deep.equal([])
            expect(value).to.equal(ruleObject.evaluate)
            expect(analysis instanceof AnalysisNode).to.equal(true)
            expect(analysis.id).to.equal(id)
            expect(analysis.name).to.equal(name)
            expect(analysis.description).to.equal(description)
            expect(analysis.type).to.equal(type)
            expect(analysis.value).to.equal(value)
            expect(analysis.rules).to.deep.equal([])
          })
        })
      })
      describe('function as evaluate property', () => {
        [() => true, () => false].forEach(functionRule => {
          const terminalObject ={
            type: TERMINAL,
            evaluate: functionRule
          }
          it(`function rule returning ${String(functionRule()).toUpperCase()}: creates an appropriate rule for boolean evaluate prop on TERMINAL object`, () => {
            const ruleObject = terminalObject
            const ruleNode = new RuleNode(ruleObject)
            const {
              id, name, description, type,
              parent, rules, value, analysis,
              globalOptions, options, meta
            } = ruleNode
            expect(id).to.equal(`TERMINAL-no-name-provided`)
            expect(name).to.equal(`${TERMINAL} rule`)
            expect(description).to.equal(``)
            expect(type).to.equal(TERMINAL)
            expect(parent).to.equal(null)
            expect(globalOptions).to.deep.equal({})
            expect(options).to.deep.equal({})
            expect(meta).to.deep.equal({})
            expect(globalOptions).to.deep.equal({})
            expect(options).to.deep.equal({})
            expect(meta).to.deep.equal({})
            expect(rules).to.deep.equal([])
            expect(value).to.equal(ruleObject.evaluate(ruleNode))
            expect(analysis instanceof AnalysisNode).to.equal(true)
            expect(analysis.id).to.equal(id)
            expect(analysis.name).to.equal(name)
            expect(analysis.description).to.equal(description)
            expect(analysis.type).to.equal(type)
            expect(analysis.value).to.equal(value)
            expect(analysis.rules).to.deep.equal([])
          })
        })
        it('can modify the ruleNode instance as a part of evaluation', () => {
          const TEST_CUSTOM_PROP = {
            key: 'value'
          }
          const RANDOM_PROPERTY_NAME = '___SOMETHING_WELL_NEVER_USE____'
          const terminalObject ={
            type: TERMINAL,
            evaluate: (ruleNode) => {
              ruleNode[RANDOM_PROPERTY_NAME] = TEST_CUSTOM_PROP
              return true
            }
          }
          const ruleNode = new RuleNode(terminalObject)
          expect(ruleNode.value).to.equal(true)
          expect(ruleNode[RANDOM_PROPERTY_NAME]).to.equal(TEST_CUSTOM_PROP)
        })
      })
    })
  })
  describe('AND rule', () => {
    const TRUE_RULES = [[true, true]]
    const FALSE_RULES = [[true, false], [false, true], [false, false]]
    let rulesObject
    TRUE_RULES.forEach(rulesToUse => {
      it('TRUE: creates appropriate rule for object rule type: AND evaluating to true', () => {
        ruleObject = createRuleObject(AND, rulesToUse)
        const ruleNode = new RuleNode(ruleObject)
        const {
            id, name, description, type,
            parent, rules, value, analysis,
            globalOptions, options, meta
          } = ruleNode
        expect(id).to.equal(TEST_ID)
        expect(name).to.equal(TEST_NAME)
        expect(description).to.equal(TEST_DESCRIPTION)
        expect(type).to.equal(AND)
        expect(parent).to.equal(null)
        expect(globalOptions).to.deep.equal({})
        expect(options).to.deep.equal({})
        expect(meta).to.deep.equal({})
        expect(Array.isArray(rules)).to.equal(true) // could test individual rules
        expect(value).to.equal(true)
        expect(analysis instanceof AnalysisNode).to.equal(true)
        expect(analysis.id).to.equal(id)
        expect(analysis.name).to.equal(name)
        expect(analysis.description).to.equal(description)
        expect(analysis.type).to.equal(type)
        expect(analysis.value).to.equal(value)
        expect(analysis.rules.length).to.equal(2)
      })
    })
    FALSE_RULES.forEach(rulesToUse => {
      it('FALSE: creates appropriate rule for object rule type: AND evaluating to false', () => {
        ruleObject = createRuleObject(AND, rulesToUse)
        const ruleNode = new RuleNode(ruleObject)
        const {
            id, name, description, type,
            parent, rules, value, analysis,
            globalOptions, options, meta
          } = ruleNode
        expect(id).to.equal(TEST_ID)
        expect(name).to.equal(TEST_NAME)
        expect(description).to.equal(TEST_DESCRIPTION)
        expect(type).to.equal(AND)
        expect(parent).to.equal(null)
        expect(globalOptions).to.deep.equal({})
        expect(options).to.deep.equal({})
        expect(meta).to.deep.equal({})
        expect(Array.isArray(rules)).to.equal(true) // could test individual rules
        expect(value).to.equal(false)
        expect(analysis instanceof AnalysisNode).to.equal(true)
        expect(analysis.id).to.equal(id)
        expect(analysis.name).to.equal(name)
        expect(analysis.description).to.equal(description)
        expect(analysis.type).to.equal(type)
        expect(analysis.value).to.equal(value)
        expect(analysis.rules.length).to.equal(rules.length)
        analysis.rules.forEach(analysisRule => {
          expect(analysisRule instanceof AnalysisNode).to.equal(true)
        })
      })
    })
  })
  describe('OR rule', () => {
    const TRUE_RULES = [[true, true], [true, false], [false, true]]
    const FALSE_RULES = [[false, false]]
    let rulesObject
    TRUE_RULES.forEach(rulesToUse => {
      it('TRUE: creates appropriate rule for object rule type: OR evaluating to true', () => {
        ruleObject = createRuleObject(OR, rulesToUse)
        const ruleNode = new RuleNode(ruleObject)
        const {
            id, name, description, type,
            parent, rules, value, analysis,
            globalOptions, options, meta
          } = ruleNode
        expect(id).to.equal(TEST_ID)
        expect(name).to.equal(TEST_NAME)
        expect(description).to.equal(TEST_DESCRIPTION)
        expect(type).to.equal(OR)
        expect(parent).to.equal(null)
        expect(globalOptions).to.deep.equal({})
        expect(options).to.deep.equal({})
        expect(meta).to.deep.equal({})
        expect(Array.isArray(rules)).to.equal(true) // could test individual rules
        expect(value).to.equal(true)
        expect(analysis instanceof AnalysisNode).to.equal(true)
        expect(analysis.id).to.equal(id)
        expect(analysis.name).to.equal(name)
        expect(analysis.description).to.equal(description)
        expect(analysis.type).to.equal(type)
        expect(analysis.value).to.equal(value)
        expect(analysis.rules.length).to.equal(rules.length)
        analysis.rules.forEach(analysisRule => {
          expect(analysisRule instanceof AnalysisNode).to.equal(true)
        })
      })
    })
    FALSE_RULES.forEach(rulesToUse => {
      it('FALSE: creates appropriate rule for object rule type: OR evaluating to false', () => {
        ruleObject = createRuleObject(OR, rulesToUse)
        const ruleNode = new RuleNode(ruleObject)
        const {
            id, name, description, type,
            parent, rules, value, analysis,
            globalOptions, options, meta
          } = ruleNode
        expect(id).to.equal(TEST_ID)
        expect(name).to.equal(TEST_NAME)
        expect(description).to.equal(TEST_DESCRIPTION)
        expect(type).to.equal(OR)
        expect(parent).to.equal(null)
        expect(globalOptions).to.deep.equal({})
        expect(options).to.deep.equal({})
        expect(meta).to.deep.equal({})
        expect(Array.isArray(rules)).to.equal(true) // could test individual rules
        expect(value).to.equal(false)
        expect(analysis instanceof AnalysisNode).to.equal(true)
        expect(analysis.id).to.equal(id)
        expect(analysis.name).to.equal(name)
        expect(analysis.description).to.equal(description)
        expect(analysis.type).to.equal(type)
        expect(analysis.value).to.equal(value)
        expect(analysis.rules.length).to.equal(rules.length)
        analysis.rules.forEach(analysisRule => {
          expect(analysisRule instanceof AnalysisNode).to.equal(true)
        })
      })
    })
  })
  describe('XOR rule', () => {
    const TRUE_RULES = [[true, false], [false, true]]
    const FALSE_RULES = [[true, true], [false, false]]
    let rulesObject
    TRUE_RULES.forEach(rulesToUse => {
      it('TRUE: creates appropriate rule for object rule type: XOR evaluating to true', () => {
        ruleObject = createRuleObject(XOR, rulesToUse)
        const ruleNode = new RuleNode(ruleObject)
        const {
            id, name, description, type,
            parent, rules, value, analysis,
            globalOptions, options, meta
          } = ruleNode
        expect(id).to.equal(TEST_ID)
        expect(name).to.equal(TEST_NAME)
        expect(description).to.equal(TEST_DESCRIPTION)
        expect(type).to.equal(XOR)
        expect(parent).to.equal(null)
        expect(globalOptions).to.deep.equal({})
        expect(options).to.deep.equal({})
        expect(meta).to.deep.equal({})
        expect(Array.isArray(rules)).to.equal(true) // could test individual rules
        expect(value).to.equal(true)
        expect(analysis instanceof AnalysisNode).to.equal(true)
        expect(analysis.id).to.equal(id)
        expect(analysis.name).to.equal(name)
        expect(analysis.description).to.equal(description)
        expect(analysis.type).to.equal(type)
        expect(analysis.value).to.equal(value)
        expect(analysis.rules.length).to.equal(rules.length)
        analysis.rules.forEach(analysisRule => {
          expect(analysisRule instanceof AnalysisNode).to.equal(true)
        })
      })
    })
    FALSE_RULES.forEach(rulesToUse => {
      it('FALSE: creates appropriate rule for object rule type: XOR evaluating to false', () => {
        ruleObject = createRuleObject(XOR, rulesToUse)
        const ruleNode = new RuleNode(ruleObject)
        const {
            id, name, description, type,
            parent, rules, value, analysis,
            globalOptions, options, meta
          } = ruleNode
        expect(id).to.equal(TEST_ID)
        expect(name).to.equal(TEST_NAME)
        expect(description).to.equal(TEST_DESCRIPTION)
        expect(type).to.equal(XOR)
        expect(parent).to.equal(null)
        expect(globalOptions).to.deep.equal({})
        expect(options).to.deep.equal({})
        expect(meta).to.deep.equal({})
        expect(Array.isArray(rules)).to.equal(true) // could test individual rules
        expect(value).to.equal(false)
        expect(analysis instanceof AnalysisNode).to.equal(true)
        expect(analysis.id).to.equal(id)
        expect(analysis.name).to.equal(name)
        expect(analysis.description).to.equal(description)
        expect(analysis.type).to.equal(type)
        expect(analysis.value).to.equal(value)
        expect(analysis.rules.length).to.equal(rules.length)
        analysis.rules.forEach(analysisRule => {
          expect(analysisRule instanceof AnalysisNode).to.equal(true)
        })
      })
    })
  })
  describe('global options object', () => {
    let ruleObject
    let globalOptions = {
      key: 'value',
      func: () => {},
      bool: true
    }
    describe('for object value of ruleObject', () => {
      beforeEach(() => {
        ruleObject = createRuleObject(AND, [true, true])
      })
      it('sets an empty object by default', () => {
        const ruleNode = new RuleNode(ruleObject, null)
        expect(ruleNode.globalOptions).to.deep.equal({})
      })
      it('sets the global options object passed', () => {
        const ruleNode = new RuleNode(ruleObject, null, globalOptions)
        expect(ruleNode.globalOptions).to.equal(globalOptions)
      })
    })
    describe('for boolean value of ruleObject', () => {
      beforeEach(() => {
        ruleObject =true
      })
      it('sets an empty object by default', () => {
        const ruleNode = new RuleNode(ruleObject, null)
        expect(ruleNode.globalOptions).to.deep.equal({})
      })
    })
    describe('for function value of ruleObject', () => {
      beforeEach(() => {
        ruleObject = () => {}
      })
      it('sets an empty object by default', () => {
        const ruleNode = new RuleNode(ruleObject, null)
        expect(ruleNode.globalOptions).to.deep.equal({})
      })
    })
  })
  describe('options object', () => {
    let ruleObject
    describe('for object value of ruleObject', () => {
      let options = {
        key: 'options value',
        nestedObject: {
          key: 'nested options value'
        }
      }
      beforeEach(() => {
        ruleObject = createRuleObject(AND, [true, true])
      })
      it('sets an empty object by default', () => {
        const ruleNode = new RuleNode(ruleObject, null)
        expect(ruleNode.options).to.deep.equal({})
      })
      it('sets the options object from ruleObject passed', () => {
        ruleObject.options = options
        const ruleNode = new RuleNode(ruleObject, null)
        expect(ruleNode.options).to.equal(options)
      })
    })
    describe('for boolean value of ruleObject', () => {
      beforeEach(() => {
        ruleObject =true
      })
      it('sets an empty object by default', () => {
        const ruleNode = new RuleNode(ruleObject, null)
        expect(ruleNode.options).to.deep.equal({})
      })
    })
    describe('for function value of ruleObject', () => {
      beforeEach(() => {
        ruleObject = () => true
      })
      it('sets an empty object by default', () => {
        const ruleNode = new RuleNode(ruleObject, null)
        expect(ruleNode.options).to.deep.equal({})
      })
    })
  })
  describe('meta object', () => {
    let ruleObject
    describe('for meta value of ruleObject', () => {
      let meta, globalOptions
      beforeEach(() => {
        meta = {
          metaFrom: 'rulesObject',
          isFromRuleObject: true,
          key: 'meta value',
          nestedObject: {
            key: 'nested meta value'
          }
        }
        globalOptions = {
          meta: {
            metaFrom: 'globalOptions',
            isFromGlobalOptions: true
          }
        }
        ruleObject = createRuleObject(AND, [true, true])
      })
      it('sets an empty object if no meta exists on either ruleObject or globalMeta', () => {
        const ruleNode = new RuleNode(ruleObject, null)
        expect(ruleNode.meta).to.deep.equal({})
      })
      it('sets a shallow copy of meta from ruleObject on ruleNode', () => {
        ruleObject.meta = meta
        const ruleNode = new RuleNode(ruleObject, null)
        expect(ruleNode.meta).not.to.equal(meta)
        expect(ruleNode.meta).to.deep.equal(meta)
      })
      it('sets a shallow copy of meta from globalOptions on ruleNode', () => {
        const ruleNode = new RuleNode(ruleObject, null, globalOptions)
        expect(ruleNode.meta).not.to.equal(globalOptions.meta)
        expect(ruleNode.meta).to.deep.equal(globalOptions.meta)
      })
      it('sets a shallow copy of meta from globalOptions and ruleObject (ruleObject takes preference)', () => {
        ruleObject.meta = meta
        const ruleNode = new RuleNode(ruleObject, null, globalOptions)
        expect(ruleNode.meta.metaFrom).to.equal(meta.metaFrom)
        expect(ruleNode.meta.metaFrom).not.to.equal(globalOptions.meta.metaFrom)
        expect(ruleNode.meta.isFromRuleObject).to.equal(meta.isFromRuleObject)
        expect(ruleNode.meta.isFromGlobalOptions).to.equal(globalOptions.meta.isFromGlobalOptions)
      })
    })
    describe('for boolean value of ruleObject', () => {
      beforeEach(() => {
        ruleObject =true
      })
      it('sets an empty object by default', () => {
        const ruleNode = new RuleNode(ruleObject, null)
        expect(ruleNode.options).to.deep.equal({})
      })
    })
    describe('for function value of ruleObject', () => {
      beforeEach(() => {
        ruleObject = () => true
      })
      it('sets an empty object by default', () => {
        const ruleNode = new RuleNode(ruleObject, null)
        expect(ruleNode.options).to.deep.equal({})
      })
    })
  })
})

