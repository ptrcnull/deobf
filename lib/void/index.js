const estraverse = require('estraverse')

module.exports = parsed => {
  return estraverse.replace(parsed, {
    enter: node => {
      if (
        node.type === 'UnaryExpression' &&
        node.operator === 'void'
      ) {
        return { type: 'Identifier', name: 'undefined' }
      }
    }
  })
}
