const estraverse = require('estraverse')
const replaceIn = require('./util/replaceIn')

module.exports = parsed => {
  return estraverse.replace(parsed, {
    enter: (node, parent) => {
      if (
        node.type === 'ExpressionStatement' &&
        node.expression.type === 'SequenceExpression'
      ) {
        const exprs = node.expression.expressions.map(expr => ({
          type: 'ExpressionStatement',
          expression: expr
        }))
        if (parent.type === 'BlockStatement') {
          replaceIn(parent.body, node, exprs)
        }
        if (parent.type === 'SwitchCase') {
          replaceIn(parent.consequent, node, exprs)
        }
      }
    }
  })
}