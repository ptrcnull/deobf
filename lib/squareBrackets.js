const estraverse = require('estraverse')

module.exports = parsed => {
  return estraverse.replace(parsed, {
    enter: node => {
      if (
        node.type === 'MemberExpression' &&
        node.computed &&
        node.property.type === 'Literal' &&
        typeof node.property.value === 'string' &&
        !(/^\d/.test(node.property.value)) &&
        !node.property.value.includes('.') &&
        !node.property.value.includes('-') &&
        !node.property.value.includes(' ') &&
        !node.property.value.includes('[') &&
        !node.property.value.includes(']') &&
        !node.property.value.includes('@') &&
        !node.property.value.includes('*')
      ) {
        node.computed = false
        node.property = {
          type: 'Identifier',
          name: node.property.value
        }
      }
    }
  })
}
