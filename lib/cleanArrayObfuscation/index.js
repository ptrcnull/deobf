const estraverse = require('estraverse')
const getArrayDeclaration = require('./getArrayDeclaration')
const getArrayResolvingFunction = require('./getArrayResolvingFunction')
const getRotateCount = require('./getRotateCount')

module.exports = parsed => {
  const array = getArrayDeclaration(parsed.body)
  const func = getArrayResolvingFunction(parsed.body, array.name)
  if (func) {
    const rotateCount = getRotateCount(parsed.body, array.name)
    rotate(array.array, rotateCount + 1)
    // console.log('rotateCount', rotateCount)

    return estraverse.replace(parsed, {
      enter: node => {
        if (node.type === 'CallExpression' && node.callee.name === func.name) {
          const index = node.arguments[0].value - 0
          const value = array.array[index]
          return {
            type: 'Literal',
            value,
            raw: JSON.stringify(value)
          }
        }
      }
    })
  } else {
    return estraverse.replace(parsed, {
      enter: node => {
        if (
          node.type === 'MemberExpression' &&
          node.computed &&
          node.object.name === array.name
        ) {
          const value = array.array[node.property.value]
          return {
            type: 'Literal',
            value,
            raw: JSON.stringify(value)
          }
        }
      }
    })
  }
}

function rotate (array, count) {
  while (--count) {
    array.push(array.shift())
  }
}
