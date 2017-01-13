'use strict'

const { getEnv, typeConversion } = require('./utils')
const urlgrey = require('urlgrey')

module.exports = function (envVarName, password, defaultUri, options) {
  const envObj = urlgrey(getEnv(envVarName, defaultUri))

  const outp = {
    uri: `${envObj.protocol()}://${envObj.hostname()}`,
    username: envObj.username(),
    password: password
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

module.exports.defaultSettings = {
  ldapClient: {
    version: 3,
    searchlimit: 10,
    searchtimeout: 10, // seconds
    connecttimeout: 3000, // ms
    timeout: 3000, // ms
    maxconnections: 10, //
    checkinterval: 10000, // ms
    maxidletime: 300000, // ms
    scope: 'sub'
  }
}
