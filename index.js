const esprima = require('esprima')
const escodegen = require('escodegen')
const fs = require('fs-extra')
const cleanArrayObfuscation = require('./lib/cleanArrayObfuscation')
const cleanSquareBrackets = require('./lib/cleanSquareBrackets')
const cleanRequireNames = require('./lib/cleanRequireNames')

async function main () {
  const file = await fs.readFile(process.argv[2], 'utf8')
  let parsed = esprima.parseScript(file)

  parsed = cleanArrayObfuscation(parsed)
  parsed = cleanSquareBrackets(parsed)
  parsed = cleanRequireNames(parsed)

  console.log(eval(process.argv[3])) // eslint-disable-line no-eval

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
