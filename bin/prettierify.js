#!/usr/bin/env node
let fixer = require('../fixer')
let argv = require('minimist')(process.argv.slice(2))

fixer.run()

if (!argv.n) {
  fixer.format()
}
