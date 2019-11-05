const chai = require('chai')
const RuleNode = require('../dist/ruleTree/RuleNode').default
const { AND, OR, XOR, TERMINAL } = require('../dist/constants/ruleTypes')
const { expect } = chai

const TEST_ID = 'TEST_ID'
const TEST_NAME = 'TEST_NAME'
const TEST_DESCRIPTION = 'TEST_DESCRIPTION'
const createRuleObject = (type, rules = []) => ({
    id: TEST_ID,
    name: TEST_NAME,
    description: TEST_DESCRIPTION,
    type,
    rules
  })

let ruleObject, ruleNode
describe('RuleNode', () => {
  describe('basic properties', () => {
    beforeEach(() => {
      ruleObject = createRuleObject(AND)
    })
    describe('id', () => {
      beforeEach(() => {
        ruleNode = new RuleNode(ruleObject)
      })
      it('set the rule node to the id property of the ruleObject', () => {
        expect(ruleNode.id).to.equal(ruleObject.id)
      })
      it.only('set the rule node id to random string of the ruleObject if no id is provided', () => {
        delete ruleObject.id
        console.log(ruleObject)
        ruleNode = new RuleNode(ruleObject)
        expect(ruleNode.id).to.exist
        console.log(ruleNode)
        expect(ruleNode.id).to.equal(ruleObject.id)
      })
    })
  })
})