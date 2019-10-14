import RuleNode from './ruleNode'

class AnalysisNode {
  id: string;
  name: string;
  description: string;
  type: string;
  value: boolean | null;
  rules: AnalysisNode[];

  constructor (ruleNode: RuleNode, analysisOptions: any = {}) {
    const { id, value, name, type, description } = ruleNode
    this.id = id
    this.name = name
    this.description = description
    this.type = type
    this.value = value
    this.rules = []
    const { analyze } = analysisOptions

    if (analyze && typeof analyze === 'function') {
      analyze(this, ruleNode, analysisOptions)
    } else {
      this._defaultAnalysis(ruleNode)
    }
  }
  _defaultAnalysis (ruleNode: RuleNode) {
    const { rules = []} = ruleNode
    rules.forEach(ruleNode => {
        this.rules.push(ruleNode.analysis)
    })
  }
}

export default AnalysisNode