const estraverse = require('estraverse')
const Literal = require('../Literal')

module.exports = parsed => {
  parsed = estraverse.replace(parsed, {
    enter: node => {
      // ![]
      if (
        node.type === 'UnaryExpression' &&
        node.operator === '!' &&
        node.argument.type === 'ArrayExpression' &&
        node.argument.elements.length === 0
      ) {
        return Literal(false)
      }
    }
  })

  return estraverse.replace(parsed, {
    enter: node => {
      if (
        node.type === 'UnaryExpression' &&
        node.operator === '!' &&
        node.argument.type === 'Literal'
      ) {
        return Literal(!node.argument.value)
      }
    }
  })
}
