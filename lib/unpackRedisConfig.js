'use strict'

const { getEnv, typeConversion } = require('./utils')
const urlgrey = require('urlgrey')
const qs = require('qs')

module.exports = function (envVarName, defaultUri, options) {
  const envObj = urlgrey(getEnv(envVarName, defaultUri))

  const outp = {
    host: envObj.hostname(),
    port: envObj.port()
  }

  if (typeof options === 'object') {
    Object.assign(outp, options)
  }

  if (envObj.queryString) {
    const tmpQuery = qs.parse(envObj.queryString())
    Object.keys(tmpQuery).forEach((key) => {
      outp[key] = typeConversion(tmpQuery[key])
    })
  }
  return outp
}
