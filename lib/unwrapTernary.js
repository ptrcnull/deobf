const estraverse = require('estraverse')

function wrapBlock(body) {
  if (body.type.endsWith('Expression')) {
    body = {
      type: 'ExpressionStatement',
      expression: body
    }
  }
  return {
    type: 'BlockStatement',
    body: [ body ]
  }
}

module.exports = parsed => {
  return estraverse.replace(parsed, {
    enter: node => {
      if (node.type === 'ExpressionStatement' && node.expression.type === 'ConditionalExpression') {
        return {
          type: 'IfStatement',
          test: node.expression.test,
          consequent: wrapBlock(node.expression.consequent),
          alternate: wrapBlock(node.expression.alternate)
        }
      }
    }
  })
}
