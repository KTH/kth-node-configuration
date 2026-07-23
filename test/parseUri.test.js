const parseUri = require('../lib/parseUri')

describe('parseUri', () => {
  it('can decode protocol, hostname, port and path', () => {
    const obj = parseUri('http://example.com:1234/some/path?a=1')
    expect(obj.protocol()).toEqual('http')
    expect(obj.hostname()).toEqual('example.com')
    expect(obj.port()).toEqual(1234)
    expect(obj.path()).toEqual('/some/path')
  })

  it('falls back to the default port for http and https', () => {
    expect(parseUri('http://example.com/path').port()).toEqual(80)
    expect(parseUri('https://example.com/path').port()).toEqual(443)
  })

  it('returns null for the port on non-http(s) protocols without an explicit port', () => {
    expect(parseUri('mssql://example.com/path').port()).toEqual(null)
  })

  it('returns null for the path when there is none', () => {
    expect(parseUri('mongodb://user:pw@example.com:10255?ssl=true').path()).toEqual(null)
  })

  it('splits host-like paths the same way as sqlite URIs expect', () => {
    const obj = parseUri('sqlite://path/to/my/db/database.sqlite')
    expect(obj.hostname()).toEqual('path')
    expect(obj.path()).toEqual('/to/my/db/database.sqlite')
  })

  it('exposes a combined host() of hostname and port', () => {
    const obj = parseUri('mongodb://user:pw@mongohost:27017/db')
    expect(obj.host()).toEqual('mongohost:27017')
  })

  it('can decode username and password', () => {
    const obj = parseUri('mssql://username:password@db.test.com/DbName')
    expect(obj.username()).toEqual('username')
    expect(obj.password()).toEqual('password')
  })

  it('decodes a percent-encoded @ in the username', () => {
    const obj = parseUri('mongodb://username@email.com:password@mongohost:27017/db')
    expect(obj.username()).toEqual('username@email.com')
    expect(obj.password()).toEqual('password')
  })

  it('decodes special characters in the password', () => {
    const obj = parseUri(
      'redis://:4W6ZrQuA6QvDrup2DIryb8hTPIrYGzx0ersukRaT+is=@localhost:6379/?ssl=true'
    )
    expect(obj.password()).toEqual('4W6ZrQuA6QvDrup2DIryb8hTPIrYGzx0ersukRaT+is=')
  })

  it('returns empty username and password when there is no userinfo at all', () => {
    const obj = parseUri('redis://localhost:6379/')
    expect(obj.username()).toEqual('')
    expect(obj.password()).toEqual('')
  })

  it('returns undefined password when a bare username has no colon', () => {
    const obj = parseUri('ldap://username@ldap.kth.se')
    expect(obj.username()).toEqual('username')
    expect(obj.password()).toEqual(undefined)
  })

  it('can decode a query string into an object', () => {
    const obj = parseUri('http://example.com?a=1&b=two')
    expect(obj.query()).toEqual({ a: '1', b: 'two' })
    expect(obj.queryString()).toEqual('a=1&b=two')
  })

  it('turns repeated query keys into an array', () => {
    const obj = parseUri('http://example.com?scope=write&scope=read')
    expect(obj.query().scope).toEqual(['write', 'read'])
  })

  it('returns null queryString and an empty query object when there is no query', () => {
    const obj = parseUri('http://example.com/path')
    expect(obj.queryString()).toEqual(null)
    expect(obj.query()).toEqual({})
  })

  it('can parse a bare query string with no scheme or host, as used for API keys', () => {
    const obj = parseUri('?name=devClient&apiKey=1234&scope=write&scope=read')
    expect(obj.query()).toEqual({
      name: 'devClient',
      apiKey: '1234',
      scope: ['write', 'read']
    })
    expect(obj.protocol()).toEqual(undefined)
    expect(obj.hostname()).toEqual(undefined)
  })
})
