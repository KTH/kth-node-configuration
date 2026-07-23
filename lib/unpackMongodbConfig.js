'use strict'

const urlgrey = require('urlgrey')
const { getEnv, typeConversion } = require('./utils')

module.exports = (envVarName, defaultUri, options) => {
  const parsedUri = urlgrey(getEnv(envVarName, defaultUri))
  const uri = getEnv(envVarName, defaultUri)

  if (!/^mongodb/.test(parsedUri.protocol())) {
    throw new Error('MongoDB URI protocol must be mongodb, got: ' + parsedUri.protocol())
  }

  const outp = {
    username: parsedUri.username(),
    password: parsedUri.password(),
    host: parsedUri._parsed.host,
    db: parsedUri._parsed.pathname && parsedUri._parsed.pathname.replace(/\//, ''),
    uri,
    authDatabase: '',
    ssl: false
  }

  if (typeof options === 'object') {
    Object.assign(outp, options)
  }

  if (parsedUri.queryString) {
    const tmpQuery = parsedUri.query()
    Object.keys(tmpQuery).forEach((key) => {
      outp[key] = typeConversion(tmpQuery[key])
    })
  }
  return outp
}
