class AnalysisNode {
  constructor (ruleNode, analysisOptions = {}) {
    const { id, value, name, type, description } = ruleNode
    this.id = id
    this.name = name
    this.description = description
    this.type = type
    this.value = value
    this.childRules = {
      passing: [],
      failing: []
    }
    const { analyze } = analysisOptions

    if (analyze && typeof analyze === 'function') {
      analyze(this, ruleNode, analysisOptions)
    } else {
      this._defaultAnalysis(ruleNode)
    }
  }
  _defaultAnalysis (ruleNode) {
    const { rules = []} = ruleNode
    rules.forEach(ruleNode => {
      if (ruleNode.value === true) {
        this.childRules.passing.push(ruleNode.analysis)
      } else if (ruleNode.value === false) {
        this.childRules.failing.push(ruleNode.analysis)
      }
    })
  }
}

module.exports = AnalysisNode