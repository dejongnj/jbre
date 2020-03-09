const chai = require('chai')
const RuleNode = require('../dist/RuleNode').default
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
    beforeEach(() => {
      ruleNode = new RuleNode(ruleObject)
    })
    describe('id property', () => {
      it('set the rule node id to the id property of the ruleObject', () => {
        expect(ruleNode.id).to.equal(ruleObject.id)
      })
      it('set the rule node id to a random string if no id is provided', () => {
        delete ruleObject.id
        ruleNode = new RuleNode(ruleObject)
        expect(ruleNode.id).to.exist
        expect(typeof ruleNode.id).to.equal('string')
      })
    })
    describe('name property', () => {
      it('set the rule node name to the name property of the ruleObject', () => {
        expect(ruleNode.name).to.equal(ruleObject.name)
      })
      it('set null rule node name if no name is provided', () => {
        delete ruleObject.name
        ruleNode = new RuleNode(ruleObject)
        expect(ruleNode.name).to.equal('')
      })
    })
    describe('description property', () => {
      it('set the rule node description to the description property of the ruleObject', () => {
        expect(ruleNode.description).to.equal(ruleObject.description)
      })
      it('set empty string rule node description if no description is provided', () => {
        delete ruleObject.description
        ruleNode = new RuleNode(ruleObject)
        expect(ruleNode.description).to.equal('')
      })
    })
  })
})