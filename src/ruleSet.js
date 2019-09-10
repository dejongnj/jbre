const fs = require("fs")

const broadAssetClasses = ['A', 'B', 'C', 'D', 'E']

const assetClasses = broadAssetClasses.reduce((assetClasses, broadAssetClass) => {
  for (let i = 1; i <= 5; i++) {
    assetClasses.push(`${broadAssetClass.toLowerCase()}${i}`)
  }
  return assetClasses
}, [])

const funds = assetClasses.reduce((funds, assetClass) => {
  for (let i = 0; i < 5; i++) {
    funds.push(`${assetClass[0].toUpperCase()}${String.fromCharCode(+assetClass[1] + 64)}${String.fromCharCode(i + 76)}${String.fromCharCode(i + 82)}${String.fromCharCode(i + 69)}`)
  }
  return funds
}, [])



// setTimeout(() => {
//   // fs.writeFileSync('test.json', JSON.stringify(funds))
// }, 5000)

const ruleSet = {
  type: 'all-true', // all elements in rules array must return true when run through rule engine
  rules: [
    {
      type: 'and',
      rules: [
        {
          type: 'description',
          rules: []
        }
      ]
    }
  ]
}

module.exports = {
  ruleSet
}