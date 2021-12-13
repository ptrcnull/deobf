module.exports = (parent, node, nodes) => {
  parent.splice(parent.findIndex(n => n === node), 1, ...nodes)
}
