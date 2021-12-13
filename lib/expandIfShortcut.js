const estraverse = require('estraverse')

const leftTypes = ['BinaryExpression', 'Identifier', 'AssignmentExpression', 'MemberExpression']
const rightTypes = ['AssignmentExpression', 'CallExpression', 'SequenceExpression', 'ConditionalExpression']

module.exports = parsed => {
  return estraverse.replace(parsed, {
    enter: node => {
      if (
        node.type === 'ExpressionStatement' &&
        node.expression.type === 'LogicalExpression' &&
        ['&&', '||'].includes(node.expression.operator) // &&
        // leftTypes.includes(node.expression.left.type) &&
        // rightTypes.includes(node.expression.right.type)
      ) {
        return {
          type: 'IfStatement',
          test: node.expression.operator === '&&'
            ? node.expression.left
            : {
              type: 'UnaryExpression',
              operator: '!',
              argument: node.expression.left,
              prefix: true
            },
          consequent: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: node.expression.right
              }
            ]
          }
        }
      }
    }
  })
}
