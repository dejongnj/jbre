import RuleNode from './RuleNode'

class RuleTree {
  options: any;
  root: RuleNode;
  constructor (rulesObject: any, globalOptions: any = {}) {
    this.options = globalOptions
    this.root = this.build(rulesObject)
  }
  build (ruleObject: any) { // builds tree from a rules object
    return new RuleNode(ruleObject, null, this.options)
  }
  evaluate () {
   return this.root.value
  }
  getAnalysis (stringifiedJSON = false) {
    return stringifiedJSON ? JSON.stringify(this.root.analysis) : this.root.analyze
  }
}

export default RuleTree
