let fs = require('fs')
let { merge } = require('lodash')
let os = require('os')

function addPrettierRc(projectPath = '') {
  let globalPrettierRcStr
  try {
    globalPrettierRcStr = fs.readFileSync(`${os.homedir()}/.prettierrc`, {
      encoding: 'utf8',
    })
  } catch (err) {}

  let prettierRc
  if (globalPrettierRcStr) {
    try {
      prettierRc = JSON.parse(globalPrettierRcStr)
    } catch (err) {
      throw err
    }
  } else {
    prettierRc = {}
  }

  let prettierRcStr = JSON.stringify(prettierRc, null, 2)
  let filepath = projectPath + '.prettierrc'
  fs.writeFileSync(filepath, prettierRcStr)
}

exports.run = function(projectPath = '') {
  let filepath = projectPath + 'package.json'

  let packageMerge = {
    scripts: {
      precommit: 'lint-staged',
    },
    'lint-staged': {
      '*.{js,json,css}': ['prettier --write', 'git add'],
      '*.ts': [
        'prettier --write',
        "tslint --fix -c ./tslint.json 'src/**/*.ts'",
        'git add',
      ],
    },
  }

  let package
  try {
    let fileStr = fs.readFileSync(filepath, { encoding: 'utf8' })
    package = JSON.parse(fileStr)
  } catch (err) {
    console.error('package.json is not an actual .json')
    throw err
  }

  let merged = merge({}, package, packageMerge)
  let mergedStr = JSON.stringify(merged, null, 2)
  fs.writeFileSync(filepath, mergedStr)
  addPrettierRc(projectPath)
  return merged
}

exports.addPrettierRc = addPrettierRc
