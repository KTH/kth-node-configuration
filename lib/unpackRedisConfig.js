'use strict'

const { getEnv, typeConversion } = require('./utils')
const urlgrey = require('urlgrey')

module.exports = function (envVarName, defaultUri, options) {
  const envObj = urlgrey(getEnv(envVarName, defaultUri))

  const outp = {
    host: envObj.hostname(),
    port: envObj.port()
  }

  if (typeof options === 'object') {
    Object.assign(outp, options)
  }

  if (typeof envObj.query === 'object') {
    var tmpQuery = envObj.query()
    Object.keys(tmpQuery).forEach((key) => {
      outp[key] = typeConversion(tmpQuery[key])
    })
  }
  return outp
}
