const estraverse = require('estraverse')

module.exports = parsed => {
  return estraverse.replace(parsed, {
    enter: node => {
      if (
        node.type === 'BlockStatement' &&
        node.body.length === 1 &&
        node.body[0].type === 'BlockStatement'
      ) {
        return node.body[0]
      }
    }
  })
}
