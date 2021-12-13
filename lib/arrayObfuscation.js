const estraverse = require('estraverse')
const getArrayDeclaration = require('./util/getArrayDeclaration')
const getArrayResolvingFunction = require('./util/getArrayResolvingFunction')
const getRotateCount = require('./util/getRotateCount')
const Literal = require('./util/Literal')

module.exports = parsed => {
  const array = getArrayDeclaration(parsed.body)
  if (!array) return parsed
  const func = getArrayResolvingFunction(parsed.body, array.name)
  if (func) {
    const rotateCount = getRotateCount(parsed.body, array.name)
    rotate(array.array, rotateCount)

    parsed = estraverse.replace(parsed, {
      enter: node => {
        // resolve all the calls to the function to literals
        if (node.type === 'CallExpression' && node.callee.name === func.name) {
          const index = node.arguments[0].value - 0
          return Literal(array.array[index])
        }

        // remove the resolving function
        if (node.type === 'VariableDeclaration') {
          const { name } = node.declarations[0].id
          if (name === func.name) {
            return estraverse.VisitorOption.Remove
          }
        }

        // remove the array rotation
        if (node.type === 'ExpressionStatement') {
          const expr = node.expression
          if (
            expr.type === 'CallExpression' &&
            expr.arguments.length === 2 &&
            expr.arguments[0].type === 'Identifier' &&
            expr.arguments[0].name === array.name &&
            expr.arguments[1].type === 'Literal'
          ) {
            return estraverse.VisitorOption.Remove
          }
        }
      }
    })
  } else {
    // resolve all the references to the array
    parsed = estraverse.replace(parsed, {
      enter: node => {
        if (
          node.type === 'MemberExpression' &&
          node.computed &&
          node.object.name === array.name
        ) {
          return Literal(array.array[node.property.value])
        }
      }
    })
  }

  // remove the array
  parsed = estraverse.replace(parsed, {
    enter: node => {
      if (node.type === 'VariableDeclaration') {
        const { name } = node.declarations[0].id
        if (name === array.name) {
          return estraverse.VisitorOption.Remove
        }
      }
    }
  })

  return parsed
}

function rotate (array, count) {
  while (count--) {
    array.push(array.shift())
  }
}
