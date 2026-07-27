const unpackLDAPConfig = require('../lib/unpackLDAPConfig')

const testURI = 'ldap://username@ldap.kth.se'
const testURIWithSSL = 'ldaps://username@ldap.kth.se'
const testURIWithQuery = 'ldap://username@ldap.kth.se?maxconnections=5&reconnectOnIdle=false'
const failProtocol = 'http://ldap.kth.se'

describe('unpackLDAPConfig', () => {
  it('can decode an LDAP config from fallback URI', () => {
    const obj = unpackLDAPConfig('no-env-exists', 'secret', testURI)
    expect(obj.uri).toEqual('ldap://ldap.kth.se')
    expect(obj.username).toEqual('username')
    expect(obj.password).toEqual('secret')
  })

  it('can decode an LDAP config from env var', () => {
    process.env.TEST_ENV_NOW_HERE = testURI
    const obj = unpackLDAPConfig('TEST_ENV_NOW_HERE', 'secret')
    expect(obj.uri).toEqual('ldap://ldap.kth.se')
    expect(obj.username).toEqual('username')
    expect(obj.password).toEqual('secret')
  })

  it('applies default LDAP client settings', () => {
    const obj = unpackLDAPConfig('no-env-exists', 'secret', testURI)
    expect(obj.version).toEqual(3)
    expect(obj.searchlimit).toEqual(10)
    expect(obj.searchtimeout).toEqual(10)
    expect(obj.connecttimeout).toEqual(3000)
    expect(obj.timeout).toEqual(3000)
    expect(obj.maxconnections).toEqual(10)
    expect(obj.checkinterval).toEqual(10000)
    expect(obj.maxidletime).toEqual(180000)
    expect(obj.reconnectOnIdle).toEqual(true)
    expect(obj.reconnectTime).toEqual(180000)
    expect(obj.scope).toEqual('sub')
  })

  it('can override default settings with options', () => {
    const obj = unpackLDAPConfig('no-env-exists', 'secret', testURI, { searchlimit: 50 })
    expect(obj.searchlimit).toEqual(50)
  })

  it('can decode an ldaps URI', () => {
    const obj = unpackLDAPConfig('no-env-exists', 'secret', testURIWithSSL)
    expect(obj.uri).toEqual('ldaps://ldap.kth.se')
  })

  it('can override defaults via the query string, with type conversion', () => {
    const obj = unpackLDAPConfig('no-env-exists', 'secret', testURIWithQuery)
    expect(obj.maxconnections).toEqual(5)
    expect(obj.reconnectOnIdle).toEqual(false)
  })

  it('should not accept wrong protocol', () => {
    let theErr
    try {
      unpackLDAPConfig('no-env-exists', 'secret', failProtocol)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.toEqual(undefined)
  })

  it('should throw when no URI is available', () => {
    let theErr
    try {
      unpackLDAPConfig('no-env-exists', 'secret', undefined)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.toEqual(undefined)
  })

  it('exposes deprecated defaultSettings', () => {
    expect(unpackLDAPConfig.defaultSettings.ldapClient.version).toEqual(3)
  })
})
