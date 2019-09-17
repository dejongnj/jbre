const { AND, OR, XOR, TERMINAL } = require('../constants/ruleTypes')


class ResultNode {
  constructor (ruleNode) {
    const { message, value, type, name } = ruleNode
    this.name = name
    this.message = message
    this.value = value
    this.type = type
    this.parent = null
    this.rules = []
  }
}

class ResultTree {
  constructor (ruleNode, options = {}) {
    this.root = this.build(ruleNode)
  }
  build(ruleNode, parentResultNode) {
    const resultNode = new ResultNode(ruleNode)
    resultNode.parent = parentResultNode || null
    resultNode.rules.push(...ruleNode.rules.map(ruleNode => this.build(ruleNode, resultNode)))
    return resultNode
  }
  returnJSON(resultNode = this.root) {
    const resultNodeClone = Object.assign({}, resultNode) // shallow clone -> don't mess with deeply nested props
    delete resultNodeClone.parent
    resultNodeClone.rules = resultNodeClone.rules.map(resultNode => this.returnJSON(resultNode))
    return resultNodeClone
  }
  analyze(resultNode = this.root) {
    const { type } = resultNode
    if (type === TERMINAL ) return this._terminalAnalysis(resultNode)
    if (type === AND) return this._andAnalysis(resultNode)
    if (type === OR) return this._orAnalysis(resultNode)
    if (type === XOR) return this._xorAnalysis(resultNode)
  }
  _andAnalysis (resultNode) {
    const { value, name } = resultNode
    const { passingRules, failingRules } = this._sortRulesIntoPassFail(resultNode)
    const numberOfRules = resultNode.rules.length
    if (value === true) {
      return {
        reason: `${name} passed because all of the rules below passed`,
        passingRules,
        failingRules
      }
    } else {
      return {
        reason: `${name} failed because ${failingRules.length} of ${numberOfRules} ${this._pluralize('rule', numberOfRules)} failed, but all needed to pass`,
        passingRules,
        failingRules
      }
    }
  }
  _orAnalysis (resultNode) {
    const { value, name } = resultNode
    const { passingRules, failingRules } = this._sortRulesIntoPassFail(resultNode)
    if (value === true) {
      return {
        reason: `${name} passed because at least 1 (${passingRules.length}) of the rules below passed.`,
        passingRules,
        failingRules
      }
    } else {
      return {
        reasons: `${name} failed because none of the rules below passed.`,
        passingRules,
        failingRules
      }
    }
  }
  _xorAnalysis (resultNode) {
    const { value, name } = resultNode
    const { passingRules, failingRules } = this._sortRulesIntoPassFail(resultNode)
    if (value === true) {
      return {
        reason: `${name} passed because exactly 1 of the rules below passed.`,
        passingRules,
        failingRules
      }
    } else {
      if (passingRules.length === 0) {
        return {
          reason: `${name} failed because none of the rules below passed. Expected exactly one to be true`,
          passingRules,
          failingRules
        }
      } else {
        return {
          reason: `${name} failed because ${passingRules.length} passed. Expected exactly one to be true`,
          passingRules,
          failingRules
        }
      }
    }
  }
  _terminalAnalysis (resultNode) {
    const { value, name } = resultNode
    if (value === true) {
      return {
        reason: `${name} passed`
      }
    } else {
      return {
        reason: `${name} failed`
      }
    }
  }
  _sortRulesIntoPassFail (resultNode) {
    return resultNode.rules.reduce((rulesObject, resultNode) => {
      if (resultNode.value === true) rulesObject.passingRules.push(this.analyze(resultNode))
      else rulesObject.failingRules.push(this.analyze(resultNode))
      return rulesObject
    }, {
      passingRules: [],
      failingRules: []
    })
  }
  
  _pluralize (word, number) {
    return number < 2 ? word : `${word}s`
  }
}

module.exports = {
  ResultNode,
  ResultTree
}