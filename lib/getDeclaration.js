module.exports = (body, pred) => {
  return body
    .filter(expr => (
      expr.type === 'VariableDeclaration' &&
      expr.declarations &&
      expr.declarations.length
    ))
    .map(expr => {
      return expr.declarations
        .map(pred)
        .find(Boolean)
    })
    .find(Boolean)
}
