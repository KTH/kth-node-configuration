'use strict'

/*
  Minimal URI parser used in place of the (unmaintained) "urlgrey" package.
  Exposes only the subset of urlgrey's API that this codebase relies on,
  built on Node's native URL and querystring modules.
*/

const querystring = require('querystring')

class ParsedUri {
  constructor(uri) {
    const queryIndex = uri.indexOf('?')
    this._queryString = queryIndex === -1 ? null : uri.slice(queryIndex + 1)
    this._url = uri.includes('://') ? new URL(uri) : null
  }

  protocol() {
    return this._url ? this._url.protocol.slice(0, -1) : undefined
  }

  hostname() {
    return this._url ? this._url.hostname : undefined
  }

  host() {
    return this._url ? this._url.host : undefined
  }

  username() {
    return this._url ? decodeURIComponent(this._url.username) : undefined
  }

  password() {
    if (!this._url) return undefined
    // No colon in the userinfo (e.g. "user@host") means no password part at all.
    if (this._url.username !== '' && this._url.password === '') return undefined
    return decodeURIComponent(this._url.password)
  }

  port() {
    if (!this._url) return null
    if (this._url.port) return parseInt(this._url.port, 10)
    switch (this.protocol()) {
      case 'http':
        return 80
      case 'https':
        return 443
      default:
        return null
    }
  }

  path() {
    if (!this._url) return null
    return this._url.pathname === '' ? null : this._url.pathname
  }

  queryString() {
    return this._queryString
  }

  query() {
    return querystring.parse(this._queryString)
  }
}

module.exports = (uri) => new ParsedUri(uri)
