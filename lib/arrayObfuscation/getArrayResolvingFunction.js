const getDeclaration = require('../getDeclaration')

module.exports = (body, arrayName) => {
  return getDeclaration(
    body,
    decl => {
      if (decl.init.type === 'FunctionExpression') {
        const func = decl.init.body
        const arrayGetter = getDeclaration(
          func.body,
          decl => {
            if (
              decl.init.type === 'MemberExpression' &&
              decl.init.computed &&
              decl.init.object &&
              decl.init.object.type === 'Identifier' &&
              decl.init.object.name === arrayName
            ) return true
          }
        )
        if (arrayGetter) {
          return {
            name: decl.id.name
          }
        }
      }
    }
  )
}
