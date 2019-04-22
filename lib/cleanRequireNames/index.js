// https://matthiashager.com/converting-snake-case-to-camel-case-object-keys-with-javascript
const toCamel = (s) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  })
}

function isRequire (node) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'require'
  )
}

const estraverse = require('estraverse')

module.exports = parsed => {
  let names = new Map()
  return estraverse.replace(parsed, {
    enter: node => {
      if (node.type === 'VariableDeclarator' && node.init && isRequire(node.init)) {
        const moduleName = node.init.arguments[0].value
        const camel = toCamel(moduleName)
        names.set(node.id.name, camel)
        node.id.name = camel
        return node
      }
      if (node.type === 'Identifier' && names.has(node.name)) {
        node.name = names.get(node.name)
        return node
      }
    }
  })
}
