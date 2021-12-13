const esprima = require('esprima')
const escodegen = require('escodegen')
const fs = require('fs-extra')
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
  parsed = commaSeparatedStatements(parsed)
  parsed = _void(parsed)

  if (process.argv[3]) console.log(eval(process.argv[3])) // eslint-disable-line no-eval

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
