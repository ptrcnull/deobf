const getDeclaration = require('../getDeclaration')

module.exports = body => {
  return getDeclaration(
    body,
    decl => {
      if (decl.init && decl.init.type === 'ArrayExpression') {
        return {
          array: decl.init.elements.map(element => element.value),
          name: decl.id.name
        }
      }
    }
  )
}
