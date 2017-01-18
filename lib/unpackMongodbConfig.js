'use strict'

const { getEnv, typeConversion } = require('./utils')
const urlgrey = require('urlgrey')
const { safeGet } = require('safe-utils')

module.exports = function (envVarName, defaultUri, options) {
  const envObj = urlgrey(getEnv(envVarName, defaultUri))
  const uri = getEnv(envVarName, defaultUri)

  const outp = {
    username: envObj.username(),
    password: envObj.password(),
    uri: uri,
    authDatabase: '',
    ssl: false
  }

  if (typeof options === 'object') {
    Object.assign(outp, options)
  }

  if (envObj.queryString) {
    var tmpQuery = envObj.query()
    Object.keys(tmpQuery).forEach((key) => {
      outp[key] = typeConversion(tmpQuery[key])
    })
  }
  return outp
}
