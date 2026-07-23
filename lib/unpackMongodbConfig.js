'use strict'

const parseUri = require('./parseUri')
const { getEnv, typeConversion } = require('./utils')

module.exports = (envVarName, defaultUri, options) => {
  const parsedUri = parseUri(getEnv(envVarName, defaultUri))
  const uri = getEnv(envVarName, defaultUri)

  if (!/^mongodb/.test(parsedUri.protocol())) {
    throw new Error('MongoDB URI protocol must be mongodb, got: ' + parsedUri.protocol())
  }

  const outp = {
    username: parsedUri.username(),
    password: parsedUri.password(),
    host: parsedUri.host(),
    db: parsedUri.path() && parsedUri.path().replace(/\//, ''),
    uri,
    authDatabase: '',
    ssl: false
  }

  if (typeof options === 'object') {
    Object.assign(outp, options)
  }

  const tmpQuery = parsedUri.query()
  Object.keys(tmpQuery).forEach((key) => {
    outp[key] = typeConversion(tmpQuery[key])
  })

  return outp
}
