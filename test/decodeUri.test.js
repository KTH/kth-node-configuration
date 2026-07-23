const decodeUri = require('../lib/decodeUri')

const testURI = 'http://example.com:1234/some/path?a=1'

describe('decodeUri', () => {
  it('can decode a URI from fallback URI', () => {
    const obj = decodeUri('no-env-exists', testURI)
    expect(obj.protocol()).toEqual('http')
    expect(obj.hostname()).toEqual('example.com')
    expect(obj.port()).toEqual(1234)
    expect(obj.path()).toEqual('/some/path')
  })

  it('can decode a URI from env var', () => {
    process.env.TEST_ENV_NOW_HERE = testURI
    const obj = decodeUri('TEST_ENV_NOW_HERE')
    expect(obj.protocol()).toEqual('http')
    expect(obj.hostname()).toEqual('example.com')
    expect(obj.port()).toEqual(1234)
    expect(obj.path()).toEqual('/some/path')
  })

  it('can decode the query string', () => {
    const obj = decodeUri('no-env-exists', testURI)
    expect(obj.query()).toEqual({ a: '1' })
  })
})
