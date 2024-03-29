'use strict'

const { getEnv, typeConversion } = require('./utils')
const urlgrey = require('urlgrey')

module.exports = (envVarName, defaultUri, options) => {
  const envObj = urlgrey(getEnv(envVarName, defaultUri))
  const uri = getEnv(envVarName, defaultUri)

  if (!/^mongodb/.test(envObj.protocol())) {
    throw new Error('MongoDB URI protocol must be mongodb, got: ' + envObj.protocol())
  }

  const outp = {
    username: envObj.username(),
    password: envObj.password(),
    host: envObj._parsed.host,
    db: envObj._parsed.pathname && envObj._parsed.pathname.replace(/\//, ''),
    uri,
    authDatabase: '',
    ssl: false
  }

  if (typeof options === 'object') {
    Object.assign(outp, options)
  }

  if (envObj.queryString) {
    const tmpQuery = envObj.query()
    Object.keys(tmpQuery).forEach((key) => {
      outp[key] = typeConversion(tmpQuery[key])
    })
  }
  return outp
}
