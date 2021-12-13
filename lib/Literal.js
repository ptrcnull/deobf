module.exports = value => ({
  type: 'Literal',
  value,
  raw: JSON.stringify(value)
})
