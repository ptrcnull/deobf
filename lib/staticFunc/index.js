const estraverse = require('estraverse')
const Literal = require('../Literal')

module.exports = parsed => {
  const functions = {}
  estraverse.traverse(parsed, {
    enter: node => {
      if (
        node.type === 'FunctionDeclaration' &&
        node.body.type === 'BlockStatement' &&
        node.body.body.length === 1 &&
        node.body.body[0].type === 'ReturnStatement' &&
        node.body.body[0].argument &&
        node.body.body[0].argument.type === 'Literal'
      ) {
        const { name } = node.id
        const { value } = node.body.body[0].argument
        functions[name] = value
      }
    }
  })

  return estraverse.replace(parsed, {
    enter: node => {
      if (
        node.type === 'FunctionDeclaration' &&
        functions[node.id.name] != null
      ) {
        return estraverse.VisitorOption.Remove
      }

      if (
        node.type === 'CallExpression' &&
        node.callee.type === 'Identifier' &&
        functions[node.callee.name] != null
      ) {
        return Literal(functions[node.callee.name])
      }
    }
  })
}
