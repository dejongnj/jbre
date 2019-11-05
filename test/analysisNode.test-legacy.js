const AnalysisNode = require('../dist/ruleTree/analysisNode').default
const { expect } = require('chai')



describe('AnalysisNode  Instance Testing', () => {
  let ruleNode
  const TEST_ID = 'test-id'
  const TEST_NAME = 'test-name'
  const TEST_DESCRIPTION = 'test-description'
  const TEST_TYPE = 'test-type'
  const TEST_VALUE_TRUE = true
  const TEST_VALUE_FALSE = false
  let mockRuleNode
  describe('default properties for analysis node', () => {
    beforeEach(() => {
      mockRuleNode = {
        id: TEST_ID,
        name: TEST_NAME,
        description: TEST_DESCRIPTION,
        type: TEST_TYPE,
        value: TEST_VALUE_TRUE
      }
    })
    it('gets default properties directly from a ruleNode instance', () => {
      const analysisNode = new AnalysisNode(mockRuleNode)
      const { id, name, description, type, value } = analysisNode
      expect(id).to.equal(mockRuleNode.id)
      expect(name).to.equal(mockRuleNode.name)
      expect(description).to.equal(mockRuleNode.description)
      expect(type).to.equal(mockRuleNode.type)
      expect(value).to.equal(mockRuleNode.value)
    })
    it('sets childRules property, with empty passing and failing arrays if no rules array was provided', () => {
      const analysisNode = new AnalysisNode(mockRuleNode)
      const { rules } = analysisNode
      expect(rules).to.deep.equal([])
    })
    describe('for rules on ruleNode being passed to analysis', () => {
      let mockPassingRule, mockFailingRule, passingChildRule, failingChildRule
      
      beforeEach(() => {
        passingChildRule = Object.assign({}, mockRuleNode, { analysis: { key: 'pass' } } )
        mockPassingRule = Object.assign({}, mockRuleNode, {
          rules: [passingChildRule]
        })
        failingChildRule = Object.assign({}, mockRuleNode, { analysis: { key: 'fail' } } )
        mockFailingRule = Object.assign({}, mockRuleNode, {
          rules: [failingChildRule],
          value: TEST_VALUE_FALSE,
          analysis: {
            description: 'this is the analysis object on the failing rule'
          }
        })
      })
      it('pushing passing rule\'s analysis option (value=true) to rules array', () => {
        const analysisNode = new AnalysisNode(mockPassingRule)
        const { rules } =  analysisNode
        expect(rules.length).to.equal(mockPassingRule.rules.length)
        expect(!!rules.find(analysis => analysis === passingChildRule.analysis)).to.equal(true)
      })
      it('pushing failing rule\'s analysis option (value=true) to rules array', () => {
        const analysisNode = new AnalysisNode(mockFailingRule)
        const { rules } =  analysisNode
        expect(rules.length).to.equal(mockFailingRule.rules.length)
        expect(!!rules.find(analysis => analysis === failingChildRule.analysis)).to.equal(true)
      })
    })
  })
})