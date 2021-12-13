const estraverse = require('estraverse')

module.exports = parsed => {
  return estraverse.replace(parsed, {
    enter: node => {
      if (
          node.type === 'BinaryExpression' &&
          ['==', '===', '!=', '!=='].includes(node.operator) &&
          (
            node.left.type === 'Literal' ||
            (
              node.left.type === 'Identifier' &&
              node.left.name === 'undefined'
            )
          )
      ) {
          const tmp = node.right
          node.right = node.left
          node.left = tmp
          return node
      }
    }
  })
}
