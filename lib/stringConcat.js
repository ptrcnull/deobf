const estraverse = require('estraverse')

module.exports = parsed => {
  let replaced = -1

  while (replaced !== 0) {
    replaced = 0
    parsed = estraverse.replace(parsed, {
      enter: node => {
        // 'left' + 'right'
        if (
          node.type === 'BinaryExpression' &&
          node.operator === '+' &&
          node.left.type === 'Literal' &&
          typeof node.left.value === 'string' &&
          node.right.type === 'Literal' &&
          typeof node.right.value === 'string'
        ) {
          replaced++
          const value = node.left.value + node.right.value
          return {
            type: 'Literal',
            value,
            raw: JSON.stringify(value)
          }
        }
      }
    })
  }

  return parsed
}
