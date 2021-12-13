const estraverse = require('estraverse')

module.exports = parsed => {
  return estraverse.replace(parsed, {
    enter: node => {
      if (node.type === 'IfStatement') {
        const replace = key => {
          if (node[key] && node[key].type !== 'BlockStatement') {
            node[key] = {
              type: 'BlockStatement',
              body: [
                node[key].type.endsWith('Expression')
                  ? {
                    type: 'ExpressionStatement',
                    expression: node[key]
                  }
                  : node[key]
              ]
            }
          }
        }

        replace('consequent')
        replace('alternate')
      }
    }
  })
}