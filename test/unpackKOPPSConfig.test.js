const unpackKOPPSConfig = require('../lib/unpackKOPPSConfig')

const testURI = 'http://kopps-r.referens.sys.kth.se/api/kopps/v2/'
const testURIWithSSL = 'https://kopps-r.referens.sys.kth.se/api/kopps/v2/'
const failProtocol = 'mailto://'

describe('unpackKOPPSConfig', () => {
  it('can decode a KOPPS URI from fallback URI', () => {
    const obj = unpackKOPPSConfig('no-env-exists', testURI)
    expect(obj.https).toEqual(false)
    expect(obj.host).toEqual('kopps-r.referens.sys.kth.se')
    expect(obj.port).toEqual(undefined)
    expect(obj.basePath).toEqual('/api/kopps/v2/')
  })

  it('can decode a KOPPS URI from env var', () => {
    process.env.TEST_ENV_NOW_HERE = testURI
    const obj = unpackKOPPSConfig('TEST_ENV_NOW_HERE')
    expect(obj.https).toEqual(false)
    expect(obj.host).toEqual('kopps-r.referens.sys.kth.se')
    expect(obj.port).toEqual(undefined)
    expect(obj.basePath).toEqual('/api/kopps/v2/')
  })

  it('can decode a KOPPS URI from fallback URI and merge with options', () => {
    const obj = unpackKOPPSConfig('no-env-exists', testURI, { extraOption: true })
    expect(obj.https).toEqual(false)
    expect(obj.host).toEqual('kopps-r.referens.sys.kth.se')
    expect(obj.port).toEqual(undefined)
    expect(obj.basePath).toEqual('/api/kopps/v2/')
    expect(obj.extraOption).toEqual(true)
  })

  it('should not expose protocol property', () => {
    const obj = unpackKOPPSConfig('no-env-exists', testURI)
    expect(obj.protocol).toEqual(undefined)
  })

  it('should not expose port if https', () => {
    const obj = unpackKOPPSConfig('no-env-exists', testURIWithSSL)
    expect(obj.port).toEqual(undefined)
    expect(obj.https).toEqual(true)
  })

  it('should not accept wrong protocol', () => {
    let theErr
    try {
      unpackKOPPSConfig('no-env-exists', failProtocol)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.toEqual(undefined)
  })
})
