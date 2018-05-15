let ncp = require('ncp').ncp
let rimraf = require('rimraf')
let { expect } = require('chai')
let fs = require('fs')
let fixer = require('./fixer')

let testProjectTemp = 'test-project-temp'

describe('add-prettier', () => {
  let initial
  let result
  beforeEach(done => {
    ncp('test-project', testProjectTemp, () => {
      initial = JSON.parse(fs.readFileSync(`${testProjectTemp}/package.json`))
      result = fixer.run(`${testProjectTemp}/`)
      done()
    })
  })

  afterEach(done => {
    rimraf(testProjectTemp, done)
  })

  it('Adds new properties to package.json', () => {
    expect(result.scripts.precommit).to.deep.equal('lint-staged')
    expect(result['lint-staged']).to.deep.equal({
      '*.{js,json,css,md}': ['prettier --write', 'git add'],
      '*.ts': [
        'prettier --write',
        "tslint --fix -c ./tslint.json 'src/**/*.ts'",
        'git add',
      ],
    })
  })

  it('Does not remove existing properties from package.json', () => {
    Object.keys(initial.scripts).forEach(key => {
      expect(initial.scripts[key]).to.deep.equal(result.scripts[key])
    })
  })

  it('Adds .prettierrc', () => {
    let rc = JSON.parse(fs.readFileSync(`${testProjectTemp}/.prettierrc`))
    expect(rc).to.deep.equal({
      semi: false,
      singleQuote: true,
      trailingComma: 'all',
    })
  })
})
