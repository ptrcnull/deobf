const estraverse = require('estraverse')

module.exports = parsed => {
  return estraverse.replace(parsed, {
    enter: node => {
      if (
        node.type === 'BlockStatement' &&
        node.body.length === 1 &&
        node.body[0].type === 'ExpressionStatement' &&
        node.body[0].expression.type === 'SequenceExpression'
      ) {
        node.body = node.body[0].expression.expressions.map(expression => ({
          type: 'ExpressionStatement',
          expression
        }))
        return node
      }

      if (
        node.type === 'BlockStatement' &&
        node.body.length > 0
      ) {
        const lastStmt = node.body[node.body.length-1]
        if (
          lastStmt.type === 'ReturnStatement' &&
          lastStmt.argument.type === 'SequenceExpression'
        ) {
          node.body.pop()
          const exprs = lastStmt.argument.expressions
          const last = exprs.pop()
          for (const expression of exprs) {
            node.body.push({
              type: 'ExpressionStatement',
              expression
            })
          }
          node.body.push({
            type: 'ReturnStatement',
            argument: last
          })
        }
      }
    }
  })
}
