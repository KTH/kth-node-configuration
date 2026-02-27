const unpackRedisConfig = require('../lib/unpackRedisConfig')

const testURI = 'redis://localhost:6379/'
const testURIWithSSL =
  'redis://:4W6ZrQuA6QvDrup2DIryb8hTPIrYGzx0ersukRaT+is=@localhost:6379/?ssl=true'
const failProtocol = 'wrong://'
const badUri = 'redis://'

// Azure url
const azureRedisConnectString = 'localhost:6380,password=jdjeeeEJsnS723Bx&FIYAPMGm3gAxlm6x8KMNSKo='
const azureRedisConnectStringSSL =
  'localhost:6380,password=jdjeeeEJsnS723Bx&FIYAPMGm3gAxlm6x8KMNSKo=,ssl=True'
const azureBadUri = 'redis:/'

describe('unpackRedisConfig', () => {
  it('can decode a Redis URI from fallback URI', () => {
    const obj = unpackRedisConfig('no-env-exists', testURI)
    expect(obj.host).toEqual('localhost')
    expect(obj.port).toEqual(6379)
  })

  it('can decode a Redis URI from env var', () => {
    process.env.TEST_ENV_NOW_HERE = testURI
    const obj = unpackRedisConfig('TEST_ENV_NOW_HERE')
    expect(obj.host).toEqual('localhost')
    expect(obj.port).toEqual(6379)
  })

  it('can decode a Redis URI from fallback URI and merge with options', () => {
    const obj = unpackRedisConfig('no-env-exists', testURI, { extraOption: true })
    expect(obj.host).toEqual('localhost')
    expect(obj.port).toEqual(6379)
    expect(obj.extraOption).toEqual(true)
  })

  it('should not expose protocol property', () => {
    const obj = unpackRedisConfig('no-env-exists', testURI)
    expect(obj.protocol).toEqual(undefined)
  })

  it('can handle ssl for Azure', () => {
    const obj = unpackRedisConfig('no-env-exists', testURIWithSSL)
    expect(obj.auth_pass).toEqual('4W6ZrQuA6QvDrup2DIryb8hTPIrYGzx0ersukRaT+is=')
    expect(obj.tls.servername).toEqual('localhost')
  })

  it('should not accept wrong protocol', () => {
    let theErr
    try {
      unpackRedisConfig('no-env-exists', failProtocol)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.toEqual(undefined)
  })

  it('should not accept undefined hostname', () => {
    let theErr
    try {
      unpackRedisConfig('no-env-exists', badUri)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.toEqual(undefined)
  })

  // Azure test
  it('azure can decode redis connection string', () => {
    process.env.AZURE_CONNECT_STRING = azureRedisConnectString

    const obj = unpackRedisConfig('AZURE_CONNECT_STRING', undefined)
    expect(obj.host).toEqual('localhost')
    expect(obj.port).toEqual(6380)

    process.env.AZURE_CONNECT_STRING = undefined
  })

  it('azure can decode redis connection string from fallbackURI', () => {
    const obj = unpackRedisConfig('no-env-exists', azureRedisConnectString)
    expect(obj.host).toEqual('localhost')
    expect(obj.port).toEqual(6380)
  })

  it('azure can decode redis connection string with ssl', () => {
    process.env.AZURE_CONNECT_STRING = azureRedisConnectStringSSL

    const obj = unpackRedisConfig('AZURE_CONNECT_STRING', undefined)
    expect(obj.tls.servername).toEqual('localhost')
    expect(obj.auth_pass).toEqual('jdjeeeEJsnS723Bx&FIYAPMGm3gAxlm6x8KMNSKo=')

    process.env.AZURE_CONNECT_STRING = undefined
  })

  it('azure can decode a Redis URI from env var', () => {
    process.env.TEST_ENV_NOW_HERE = azureRedisConnectString
    const obj = unpackRedisConfig('TEST_ENV_NOW_HERE')
    expect(obj.host).toEqual('localhost')
    expect(obj.port).toEqual(6380)
  })

  it('azure can decode a Redis URI from fallback URI and merge with options', () => {
    const obj = unpackRedisConfig('no-env-exists', azureRedisConnectString, { extraOption: true })
    expect(obj.host).toEqual('localhost')
    expect(obj.port).toEqual(6380)
    expect(obj.extraOption).toEqual(true)
  })

  it('azure should not expose protocol property', () => {
    const obj = unpackRedisConfig('no-env-exists', azureRedisConnectString)
    expect(obj.protocol).toEqual(undefined)
  })

  it('azure should not accept bad hostname', () => {
    let theErr
    try {
      unpackRedisConfig('no-env-exists', azureBadUri)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.toEqual(undefined)
  })
})
