'use strict'

/*
  Minimal URI parser built on Node's native URL and querystring modules.
*/

const querystring = require('querystring')

class ParsedUri {
  constructor(uri) {
    const queryIndex = uri.indexOf('?')
    this.queryString = queryIndex === -1 ? null : uri.slice(queryIndex + 1)
    this.query = querystring.parse(this.queryString)

    const url = uri.includes('://') ? new URL(uri) : null

    this.protocol = url?.protocol.slice(0, -1)
    this.hostname = url?.hostname
    this.host = url?.host
    this.path = url?.pathname || null

    // url.password is '' both when no password was given ("user@host") and when it's
    // explicitly empty ("user:@host") -- URL can't tell those apart.
    const hasBareUsername = !!url && url.username !== '' && url.password === ''
    this.username = url ? decodeURIComponent(url.username) : undefined
    this.password = !url || hasBareUsername ? undefined : decodeURIComponent(url.password)

    if (!url) {
      this.port = null
    } else if (url.port) {
      this.port = parseInt(url.port, 10)
    } else if (this.protocol === 'http') {
      this.port = 80
    } else if (this.protocol === 'https') {
      this.port = 443
    } else {
      this.port = null
    }
  }
}

module.exports = (uri) => new ParsedUri(uri)
