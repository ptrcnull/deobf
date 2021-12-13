const esprima = require('esprima')
const escodegen = require('escodegen')
const fs = require('fs-extra')
const arrayObfuscation = require('./lib/arrayObfuscation')
const squareBrackets = require('./lib/squareBrackets')
const requireNames = require('./lib/requireNames')

async function main () {
  const file = await fs.readFile(process.argv[2], 'utf8')
  let parsed = esprima.parseScript(file)

  parsed = arrayObfuscation(parsed)
  parsed = squareBrackets(parsed)
  parsed = requireNames(parsed)

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
