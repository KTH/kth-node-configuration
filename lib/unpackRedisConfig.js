'use strict'

const urlgrey = require('urlgrey')
const qs = require('qs')
const { getEnv, typeConversion } = require('./utils')

function generateRedisUrlFromAzure(obj) {
  try {
    const azure = obj.split(',')
    const [host, passwordString] = azure
    const password = passwordString.replace('password=', '')

    let redisUrl = 'redis://:' + encodeURIComponent(password) + '@' + host
    // Add QueryString
    if (azure.length > 2) {
      redisUrl += '?'
      for (let i = 2; i < azure.length; i++) {
        redisUrl = azure.length - 1 === i ? redisUrl + azure[i] : redisUrl + azure[i] + '&'
      }
    }
    return redisUrl
  } catch {
    throw new Error('Fields missing in Azure connection string')
  }
}

module.exports = (envVarName, defaultUri, options) => {
  let parsedUri

  // Azure connection string check
  if (!/^[a-z]*:\W\W/.test(getEnv(envVarName, defaultUri))) {
    parsedUri = urlgrey(generateRedisUrlFromAzure(getEnv(envVarName, defaultUri)))
  } else {
    parsedUri = urlgrey(getEnv(envVarName, defaultUri))
  }

  if (!/^redis/.test(parsedUri.protocol())) {
    throw new Error('Redis URI protocol must be redis, got: ' + parsedUri.protocol())
  }
  if (!parsedUri.hostname()) {
    throw new Error('Redis requires a hostname')
  }

  const outp = {
    host: parsedUri.hostname(),
    port: parsedUri.port()
  }

  if (typeof options === 'object') {
    Object.assign(outp, options)
  }

  if (parsedUri.queryString) {
    const tmpQuery = qs.parse(parsedUri.queryString())
    Object.keys(tmpQuery).forEach((key) => {
      if (key === 'ssl' && tmpQuery[key]) {
        // ssl === true
        outp.tls = { servername: parsedUri.hostname() }
        outp.auth_pass = parsedUri.password()
      } else {
        outp[key] = typeConversion(tmpQuery[key])
      }
    })
  }
  return outp
}
