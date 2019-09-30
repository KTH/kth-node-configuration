/* eslint-disable no-console */

'use strict'

const { safeGet } = require('safe-utils')

module.exports.getEnv = (name, defaultVal) => {
  const outp = process.env[name] || defaultVal
  if (outp === undefined) {
    console.warn(
      'You have not configured any value for "' +
        name +
        '" and there was no default value. This could cause strange errors, check your environment variable configurations!'
    )
  }
  return outp
}

// return development defaults only if in development mode. Prevents accidentally carrying dev defaults to referens
module.exports.devDefaults = def => {
  const env = process.env.NODE_ENV
  if (env === 'development' || env === 'dev') return def
  return ''
}

module.exports.setLoggingDefaults = () => {
  const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev'
  if (!process.env.CONSOLE_ENABLED) {
    if (isDev) {
      process.env.CONSOLE_ENABLED = 'true'
    } else {
      process.env.CONSOLE_ENABLED = 'false'
    }
  }
  if (!process.env.STDOUT_ENABLED) {
    if (isDev) {
      process.env.STDOUT_ENABLED = 'false'
    } else {
      process.env.STDOUT_ENABLED = 'true'
    }
  }
}

module.exports.typeConversion = inp => {
  if (parseInt(inp).toString() === inp) {
    return parseInt(inp)
  } else if (safeGet(() => inp.toLowerCase() === 'true')) {
    return true
  } else if (safeGet(() => inp.toLowerCase() === 'false')) {
    return false
  } else if (inp === 'undefined') {
    return undefined
  }
  return inp
}

module.exports.decodeArray = (envVarName, defaultUri) => {
  const tmp = process.env[envVarName]

  const outp = []
  if (tmp !== undefined && tmp !== 'undefined') {
    outp.push(tmp)
  }

  let i = 0
  while (process.env[envVarName + '_' + i] !== undefined) {
    outp.push(process.env[envVarName + '_' + i])
    i++
  }

  if (outp.length === 0) {
    return [defaultUri]
  }
  return outp
}
