let path = require('path')
let fs = require('fs')

function inIgnoreList(name, ignoreList) {
  for (let reg of ignoreList) {
    if (reg.test(name)) {
      return true
    }
  }
  return false
}

function fromDir(
  startPath,
  filter = /\.(js|json|ts)$/,
  found = [],
  ignoreDirs = [/node_modules/],
) {
  if (!fs.existsSync(startPath)) {
    return []
  }

  for (let file of fs.readdirSync(startPath)) {
    let filename = path.join(startPath, file)
    let stat = fs.lstatSync(filename)
    if (stat.isDirectory() && !inIgnoreList(filename, ignoreDirs)) {
      fromDir(filename, filter, found)
    } else if (filter.test(filename)) {
      found.push(filename)
    }
  }

  return found
}

exports.fromDir = fromDir
