const estraverse = require('estraverse')

function genClass(id, body) {
  return {
    type: 'ClassDeclaration',
    id,
    body: {
      type: 'ClassBody',
      body
    }
  }
}

function genConstructor(body) {
  return {
    type: 'MethodDefinition',
    key: {
      type: 'Identifier',
      name: 'constructor'
    },
    computed: false,
    value: body,
    kind: 'constructor',
    static: false
  }
}

function genMethod(name, body) {
  return {
    type: 'MethodDefinition',
    key: name,
    computed: name.type !== 'Identifier',
    value: body,
    kind: 'method',
    static: false
  }
}


module.exports = parsed => {
  return estraverse.replace(parsed, {
    enter: node => {
      if (
        node.type === 'VariableDeclaration' &&
        node.declarations.length === 1
      ) {
        const decl = node.declarations[0]
        if (
          decl.type === 'VariableDeclarator' &&
          decl.init &&
          decl.init.type === 'CallExpression' &&
          decl.init.callee.type === 'FunctionExpression'
        ) {
          const func = decl.init.callee.body.body
          if (
            func[0].type === 'FunctionDeclaration' &&
            func[func.length - 1].type === 'ReturnStatement'
          ) {
            let rest = func.slice(1, func.length - 1)

            if (rest.length === 0) {
              return
            }

            if (
              rest[0].type === 'VariableDeclaration' &&
              rest[0].declarations &&
              rest[0].declarations.length === 1 &&
              rest[0].declarations[0].type === 'VariableDeclarator' &&
              rest[0].declarations[0].init &&
              rest[0].declarations[0].init.type === 'MemberExpression' &&
              rest[0].declarations[0].init.property.type === 'Identifier' &&
              rest[0].declarations[0].init.property.name === 'prototype'
            ) {
              rest = rest.slice(1)
            }

            if (rest.every(stmt => (
              stmt.type === 'ExpressionStatement' &&
              stmt.expression.type === 'AssignmentExpression' &&
              stmt.expression.right.type === 'FunctionExpression'
            ))) {
              return genClass(
                node.declarations[0].id,
                [
                  genConstructor(func[0]),
                  ...rest.map(stmt => genMethod(stmt.expression.left.property, stmt.expression.right))
                ]
              )
            }
          }
        }
      }
    }
  })
}