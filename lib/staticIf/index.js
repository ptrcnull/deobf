const estraverse = require('estraverse')

module.exports = parsed => {
  return estraverse.replace(parsed, {
    enter: node => {
      if (
        node.type === 'IfStatement' &&
        node.test.type === 'BinaryExpression' &&
        node.test.left.type === 'Literal' &&
        node.test.right.type === 'Literal'
      ) {
        const left = node.test.left.value
        const right = node.test.right.value
        let result = null
        switch (node.test.operator) {
          case '==':
            result = left == right
              ? node.consequent
              : node.alternate
            break
          case '===':
            result = left === right
              ? node.consequent
              : node.alternate
            break
          case '!=':
            result = left != right
              ? node.consequent
              : node.alternate
            break
          case '!==':
            result = left !== right
              ? node.consequent
              : node.alternate
        }
        return result || estraverse.VisitorOption.Remove
      }
    }
  })
}
