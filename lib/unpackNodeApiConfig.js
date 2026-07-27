'use strict'

const parseUri = require('./parseUri')
const { getEnv, typeConversion } = require('./utils')

module.exports = (envVarName, defaultUri, options) => {
  const parsedUri = parseUri(getEnv(envVarName, defaultUri))

  if (!/^http[s]*/.test(parsedUri.protocol)) {
    throw new Error('Node API URI protocol must be http or https, got: ' + parsedUri.protocol)
  }

  const outp = {
    https: parsedUri.protocol === 'https',
    // Netscaler doesn't answer https calls properly if we pass the port to kth-node-api-call
    port: parsedUri.protocol === 'https' ? undefined : parsedUri.port,
    host: parsedUri.hostname,
    proxyBasePath: parsedUri.path
  }

  if (typeof options === 'object') {
    Object.assign(outp, options)
  }

  const tmpQuery = parsedUri.query
  Object.keys(tmpQuery).forEach((key) => {
    outp[key] = typeConversion(tmpQuery[key])
  })

  return outp
}
