let fs = require('fs')
let { merge } = require('lodash')
let os = require('os')
let { fromDir } = require('./list-files')
let prettier = require('prettier')
let { extname } = require('path')
let npm = require('npm')
let { promisify } = require('util')

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

function getPrettierRc() {
  let prc
  try {
    let prcStr = fs.readFileSync('./.prettierrc', { encoding: 'utf8' })
    prc = JSON.parse(prcStr)
  } catch (err) {
    throw err
  }

  return prc
}

function format(projectPath = './') {
  let files = fromDir(projectPath)
  for (let filename of files) {
    let content = fs.readFileSync(filename, { encoding: 'utf8' })
    let parser = {
      '.js': 'babylon',
      '.ts': 'typescript',
      '.json': 'json',
    }
    let res = prettier.format(content, {
      parser: parser[extname(filename)],
      ...getPrettierRc(),
    })
    fs.writeFileSync(filename, res)
  }
}

async function installDeps() {
  await promisify(npm.load)({ loaded: false, 'save-dev': true })
  return promisify(npm.commands.install)(['husky', 'prettier', 'lint-staged'])
}

function run(projectPath = '') {
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
exports.run = run
exports.format = format
exports.installDeps = installDeps
