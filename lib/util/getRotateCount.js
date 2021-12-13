module.exports = (body, arrayName) => {
  return body
    .filter(expr => expr.type === 'ExpressionStatement')
    .filter(({ expression: expr }) => {
      // console.log(expr)
      return (
        expr.type === 'CallExpression' &&
        expr.arguments.length === 2 &&
        expr.arguments[0].type === 'Identifier' &&
        expr.arguments[0].name === arrayName &&
        expr.arguments[1].type === 'Literal'
      )
    })
    .map(expr => expr.expression.arguments[1].value)[0]
}
