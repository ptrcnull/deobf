const esprima = require('esprima')
const escodegen = require('escodegen')
const fs = require('fs').promises

const arrayObfuscation = require('./lib/arrayObfuscation')
const squareBrackets = require('./lib/squareBrackets')
const requireNames = require('./lib/requireNames')
const stringConcat = require('./lib/stringConcat')
const staticIf = require('./lib/staticIf')
const staticFunc = require('./lib/staticFunc')
const arrayBool = require('./lib/arrayBool')
const nestedBlocks = require('./lib/nestedBlocks')
const commaSeparatedStatements = require('./lib/commaSeparatedStatements')
const _void = require('./lib/void')
const comparisonOrder = require('./lib/comparisonOrder')
const splitVarDeclarations = require('./lib/splitVarDeclarations')
const functionToClass = require('./lib/functionToClass')
const expandIfShortcut = require('./lib/expandIfShortcut')
const unwrapTernary = require('./lib/unwrapTernary')
const addIfBraces = require('./lib/addIfBraces')
const expandSequenceExpression = require('./lib/expandSequenceExpression')

async function main () {
  const file = await fs.readFile(process.argv[2], 'utf8')
  let parsed = esprima.parseScript(file)

  parsed = arrayObfuscation(parsed)
  parsed = stringConcat(parsed)
  parsed = squareBrackets(parsed)
  parsed = requireNames(parsed)
  parsed = staticIf(parsed)
  parsed = staticFunc(parsed)
  parsed = arrayBool(parsed)
  parsed = nestedBlocks(parsed)
  parsed = _void(parsed)
  parsed = comparisonOrder(parsed)
  parsed = splitVarDeclarations(parsed)
  for (let i = 0; i < 4; i++) {
    parsed = commaSeparatedStatements(parsed)
    parsed = functionToClass(parsed)
    parsed = expandIfShortcut(parsed)
    parsed = unwrapTernary(parsed)
    parsed = addIfBraces(parsed)
    parsed = expandSequenceExpression(parsed)
  }

  // console.log(util.inspect(parsed, false, 16, true))

  const serialized = escodegen.generate(parsed, {
    format: {
      indent: {
        style: '  '
      },
      semicolons: false
    }
  })
  await fs.writeFile(process.argv[2].replace('.js', '.deobf.js'), serialized, 'utf8')
}
main()
