'use strict'

const urlgrey = require('urlgrey')
const { getEnv, typeConversion } = require('./utils')

module.exports = (envVarName, defaultUri, options) => {
  const parsedUri = urlgrey(getEnv(envVarName, defaultUri))

  if (!/^smtp[s]*/.test(parsedUri.protocol())) {
    throw new Error('SMTP URI protocol must be smtp or smtps, got: ' + parsedUri.protocol())
  }

  const outp = {
    host: parsedUri.hostname(),
    secure: parsedUri.protocol() === 'smtps',
    port: parsedUri.port()
  }

  if (parsedUri.password() || parsedUri.username()) {
    outp.auth = {
      user: parsedUri.username(),
      pass: parsedUri.password()
    }
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
