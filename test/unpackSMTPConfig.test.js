const unpackSMTPConfig = require('../lib/unpackSMTPConfig')

const testURI = 'smtp://smtp.kth.se:25'
const testURIWithSSL = 'smtps://username:password@smtp.kth.se:465'
const failProtocol = 'mailto://'

describe('unpackSMTPConfig', () => {
  it('can decode a SMTP URI from fallback URI', () => {
    const obj = unpackSMTPConfig('no-env-exists', testURI)
    expect(obj.host).toEqual('smtp.kth.se')
    expect(obj.auth).toEqual(undefined)
    expect(obj.port).toEqual(25)
  })

  it('can decode a SMTP URI from env var', () => {
    process.env.TEST_ENV_NOW_HERE = testURI
    const obj = unpackSMTPConfig('TEST_ENV_NOW_HERE')
    expect(obj.host).toEqual('smtp.kth.se')
    expect(obj.auth).toEqual(undefined)
    expect(obj.port).toEqual(25)
  })

  it('can decode a SMTP URI from fallback URI and merge with options', () => {
    const obj = unpackSMTPConfig('no-env-exists', testURI, { extraOption: true })
    expect(obj.host).toEqual('smtp.kth.se')
    expect(obj.auth).toEqual(undefined)
    expect(obj.port).toEqual(25)
    expect(obj.extraOption).toEqual(true)
  })

  it('should not expose protocol property', () => {
    const obj = unpackSMTPConfig('no-env-exists', testURI)
    expect(obj.protocol).toEqual(undefined)
  })

  it('can handle auth', () => {
    const obj = unpackSMTPConfig('no-env-exists', testURIWithSSL)
    expect(obj.auth.pass).toEqual('password')
    expect(obj.auth.user).toEqual('username')
  })

  it('sets secure on smtps', () => {
    const obj = unpackSMTPConfig('no-env-exists', testURIWithSSL)
    expect(obj.secure).toEqual(true)
  })

  it('should not accept wrong protocol', () => {
    let theErr
    try {
      unpackSMTPConfig('no-env-exists', failProtocol)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.toEqual(undefined)
  })
})
