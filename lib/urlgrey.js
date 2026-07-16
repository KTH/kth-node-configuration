'use strict'

const qs = require('qs')
const urlgreyImport = require('urlgrey')

const parseUrl =
  typeof urlgreyImport === 'function'
    ? urlgreyImport
    : urlgreyImport && typeof urlgreyImport.default === 'function'
      ? urlgreyImport.default
      : null

if (!parseUrl) {
  throw new TypeError('Unsupported urlgrey export shape')
}

const callGetter = (obj, getterName, legacyName) => {
  if (typeof obj[getterName] === 'function') {
    return obj[getterName]()
  }
  if (typeof obj[legacyName] === 'function') {
    return obj[legacyName]()
  }
  return undefined
}

const decodeMaybe = (value) => {
  if (typeof value !== 'string') {
    return value
  }
  try {
    return decodeURIComponent(value)
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return value
  }
}

const normalizeInput = (url) => {
  if (typeof url === 'string' && url.startsWith('?')) {
    return `http://localhost/${url}`
  }
  return url
}

module.exports = (url) => {
  const parsed = parseUrl(normalizeInput(url))
  const adapted = Object.create(parsed)

  adapted.protocol = () => callGetter(parsed, 'getProtocol', 'protocol')
  adapted.hostname = () => callGetter(parsed, 'getHostname', 'hostname')
  adapted.port = () => callGetter(parsed, 'getPort', 'port')
  adapted.path = () => callGetter(parsed, 'getPath', 'path')
  adapted.query = () => {
    const queryString = adapted.queryString()
    if (!queryString) {
      return {}
    }
    return qs.parse(queryString)
  }
  adapted.queryString = () => callGetter(parsed, 'getQueryString', 'queryString')
  adapted.username = () => decodeMaybe(callGetter(parsed, 'getUsername', 'username'))
  adapted.password = () => decodeMaybe(callGetter(parsed, 'getPassword', 'password'))

  adapted.host = () => {
    const hostname = adapted.hostname()
    const port = adapted.port()

    if (!hostname) {
      return hostname
    }
    if (port === null || port === undefined || port === '') {
      return hostname
    }
    return `${hostname}:${port}`
  }

  return adapted
}
