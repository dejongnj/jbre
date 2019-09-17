const { AND, XOR, OR } = require('../constants/ruleTypes')

const rulesObject = {
  type: AND,
  rules: [
    () => true,
    () => false,
    true,
    {
      type: AND,
      rules: [true, true]
    }
  ]
}

const ruleNode = {
  type: 'AND',
  parent: null,
  rules:[
    {
      type: 'TERMINAL',
      parent: [Circular],
      rules: [],
      value: true,
      message: '',
      name: 'TERMINAL rule' },
    {
      type: 'TERMINAL',
      parent: [Circular],
      rules: [],
      value: false,
      message: '',
      name: 'TERMINAL rule' },
    {
      type: 'TERMINAL',
      parent: [Circular],
      rules: [],
      value: true,
      message: '',
      name: 'TERMINAL rule' },
    {
      type: 'AND',
      parent: [Circular],
      rules:
      [ {
          type: 'TERMINAL',
          parent: [Circular],
          rules: [],
          value: true,
          message: '',
          name: 'TERMINAL rule' },
        {
          type: 'TERMINAL',
          parent: [Circular],
          rules: [],
          value: true,
          message: '',
          name: 'TERMINAL rule' } ],
      value: true,
      message: '',
      name: 'AND rule' }
    ],
  value: false,
  message: '',
  name: 'AND rule' }


const erroMessageSchema = {
  message: ''
}