'use strict'

const { getEnv, typeConversion } = require('./utils')
const urlgrey = require('urlgrey')
const qs = require('qs')

module.exports = function (envVarName, defaultUri, options) {
  const envObj = urlgrey(getEnv(envVarName, defaultUri))

  if (!/^redis/.test(envObj.protocol())) {
    throw new Error('Redis URI protocol must be redis, got: ' + envObj.protocol())
  }

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
      if (key === 'ssl' && tmpQuery[key]) {
        // ssl === true
        outp['tls'] = { servername: envObj.hostname() }
        outp['auth_pass'] = envObj.password()
      } else {
        outp[key] = typeConversion(tmpQuery[key])
      }
    })
  }
  return outp
}
