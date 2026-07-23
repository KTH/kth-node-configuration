'use strict'

const parseUri = require('./parseUri')
const { getEnv, typeConversion } = require('./utils')

const ldapDefaults = {
  version: 3,
  searchlimit: 10,
  searchtimeout: 10, // seconds
  connecttimeout: 3000, // ms
  timeout: 3000, // ms
  maxconnections: 10, //
  checkinterval: 10000, // ms
  maxidletime: 180000, // ms
  reconnectOnIdle: true,
  reconnectTime: 180000,
  scope: 'sub',
  kthId: 'u193834l'
}

module.exports = (envVarName, password, defaultUri, options) => {
  const inp = getEnv(envVarName, defaultUri)
  if (!inp) {
    throw new Error(
      'Missing LDAP URI, have you forgotten to add it to your env-vars (.env in development)'
    )
  }
  const parsedUri = parseUri(inp)

  if (!/^ldap[s]*/.test(parsedUri.protocol())) {
    throw new Error('LDAP URI protocol must be ldap or ldaps, got: ' + parsedUri.protocol())
  }

  const outp = {
    uri: `${parsedUri.protocol()}://${parsedUri.hostname()}`,
    username: parsedUri.username(),
    password
  }

  // Add default settings to ldap config object, override with options
  Object.assign(outp, ldapDefaults)

  if (typeof options === 'object') {
    Object.assign(outp, options)
  }

  const tmpQuery = parsedUri.query()
  Object.keys(tmpQuery).forEach((key) => {
    outp[key] = typeConversion(tmpQuery[key])
  })

  return outp
}

// Deprecated:
module.exports.defaultSettings = {
  ldapClient: ldapDefaults
}
