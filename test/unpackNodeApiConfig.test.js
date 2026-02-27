const unpackNodeApiConfig = require('../lib/unpackNodeApiConfig')

const testURI = 'http://node-api:3001/api/node'
const testURIWithSSL = 'https://node-api:3001/api/node'
const failProtocol = 'mailto://'

describe('unpackNodeApiConfig', () => {
  it('can decode a Mongodb URI from fallback URI', () => {
    const obj = unpackNodeApiConfig('no-env-exists', testURI)
    expect(obj.https).toEqual(false)
    expect(obj.host).toEqual('node-api')
    expect(obj.port).toEqual(3001)
    expect(obj.proxyBasePath).toEqual('/api/node')
  })

  it('can decode a Mongodb URI from env var', () => {
    process.env.TEST_ENV_NOW_HERE = testURI
    const obj = unpackNodeApiConfig('TEST_ENV_NOW_HERE')
    expect(obj.https).toEqual(false)
    expect(obj.host).toEqual('node-api')
    expect(obj.port).toEqual(3001)
    expect(obj.proxyBasePath).toEqual('/api/node')
  })

  it('can decode a Mongodb URI from fallback URI and merge with options', () => {
    const obj = unpackNodeApiConfig('no-env-exists', testURI, { extraOption: true })
    expect(obj.https).toEqual(false)
    expect(obj.host).toEqual('node-api')
    expect(obj.port).toEqual(3001)
    expect(obj.proxyBasePath).toEqual('/api/node')
    expect(obj.extraOption).toEqual(true)
  })

  it('should not expose protocol property', () => {
    const obj = unpackNodeApiConfig('no-env-exists', testURI)
    expect(obj.protocol).toEqual(undefined)
  })

  it('should not expose port if https', () => {
    const obj = unpackNodeApiConfig('no-env-exists', testURIWithSSL)
    expect(obj.port).toEqual(undefined)
    expect(obj.https).toEqual(true)
  })

  it('should not accept wrong protocol', () => {
    let theErr
    try {
      unpackNodeApiConfig('no-env-exists', failProtocol)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.toEqual(undefined)
  })
})
