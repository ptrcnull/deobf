const estraverse = require('estraverse')
const esprima = require('esprima')
const replaceIn = require('./util/replaceIn')

module.exports = parsed => {
  return estraverse.replace(parsed, {
    enter: (node, parent) => {
      if (
        node.type === 'VariableDeclaration' &&
        node.declarations.length > 1
      ) {
        if (parent.type !== 'BlockStatement') return
        
        replaceIn(parent.body, node, node.declarations.map(x => {
          return {
            type: 'VariableDeclaration',
            declarations: [ x ],
            kind: node.kind
          }
        }))
      }
    }
  })
}
