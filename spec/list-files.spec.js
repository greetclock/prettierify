let { expect } = require('chai')
let { fromDir } = require('../list-files')

describe('list-files.js', () => {
  it('Lists files', () => {
    let found = fromDir('./test-project', /\.(js|json|ts)$/)
    expect(found).to.contain('test-project/index.js')
    expect(found).to.contain('test-project/index.ts')
    expect(found).to.contain('test-project/package.json')
    expect(found.length).eq(3)
  })
})
