'use strict'

const { getEnv } = require('./utils')
const urlgrey = require('urlgrey')
var assert = require('assert')

module.exports = function (envVarName, defaultUri) {
  const inp = getEnv(envVarName, defaultUri).split(' ')

  const outp = inp.map(function (item) {
    const tmp = urlgrey(item).query()
    console.log(tmp)

    assert(tmp['name'] !== undefined, 'Missing name')
    assert(tmp['apiKey'] !== undefined, 'Missing apiKey')
    assert(tmp['scope'] !== undefined, 'Missing scope')

    if (!Array.isArray(tmp.scope)) {
      tmp.scope = [tmp.scope]
    }
    return tmp
  })

  return outp
}
