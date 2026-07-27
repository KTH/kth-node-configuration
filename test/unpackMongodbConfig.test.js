const unpackMongodbConfig = require('../lib/unpackMongodbConfig')

const testURI = 'mongodb://username@email.com:password@mongohost:27017/innovation?ssl=false'
const testAzureURI = 'mongodb://username:password@url.documents.azure.com:10255/project?ssl=true'
const failAzureURI = 'mongodb://username:password@url.documents.azure.com:10255?ssl=true'
const failProtocol = 'http://mongohost:27017/innovation'
const testURIWithoutPassword = 'mongodb://someuser@mongohost:27017/somedb'
const testURIWithoutAuth = 'mongodb://mongohost:27017/somedb'

describe('unpackMongodbConfig', () => {
  it('can decode a Mongodb URI from fallback URI', () => {
    const obj = unpackMongodbConfig('no-env-exists', testURI)
    expect(obj.username).toEqual('username@email.com')
    expect(obj.password).toEqual('password')
    expect(obj.uri).toEqual(testURI)
    expect(obj.ssl).toEqual(false)
  })

  it('can decode a Mongodb URI from env var', () => {
    process.env.TEST_ENV_NOW_HERE = testURI
    const obj = unpackMongodbConfig('TEST_ENV_NOW_HERE')
    expect(obj.username).toEqual('username@email.com')
    expect(obj.password).toEqual('password')
    expect(obj.uri).toEqual(testURI)
    expect(obj.ssl).toEqual(false)
  })

  it('can decode a Mongodb URI from fallback URI and merge with options', () => {
    const obj = unpackMongodbConfig('no-env-exists', testURI, { extraOption: true })
    expect(obj.username).toEqual('username@email.com')
    expect(obj.password).toEqual('password')
    expect(obj.uri).toEqual(testURI)
    expect(obj.ssl).toEqual(false)
    expect(obj.extraOption).toEqual(true)
  })

  it('can decode a cosmos db connection string', () => {
    const obj = unpackMongodbConfig('no-env-exists', testAzureURI)
    expect(obj.username).toEqual('username')
    expect(obj.password).toEqual('password')
    expect(obj.host).toEqual('url.documents.azure.com:10255')
    expect(obj.db).toEqual('project')
    expect(obj.uri).toEqual(testAzureURI)
    expect(obj.ssl).toEqual(true)
  })

  it('can decode a url without dbname', () => {
    const obj = unpackMongodbConfig('no-env-exists', failAzureURI)
    expect(obj.username).toEqual('username')
    expect(obj.password).toEqual('password')
    expect(obj.host).toEqual('url.documents.azure.com:10255')
    expect(obj.db).toEqual(null)
    expect(obj.uri).toEqual(failAzureURI)
    expect(obj.ssl).toEqual(true)
  })

  it('can decode a valid URI with a username but no password', () => {
    const obj = unpackMongodbConfig('no-env-exists', testURIWithoutPassword)
    expect(obj.username).toEqual('someuser')
    expect(obj.password).toEqual(undefined)
    expect(obj.host).toEqual('mongohost:27017')
    expect(obj.db).toEqual('somedb')
  })

  it('can decode a valid URI with no auth at all', () => {
    const obj = unpackMongodbConfig('no-env-exists', testURIWithoutAuth)
    expect(obj.username).toEqual('')
    expect(obj.password).toEqual('')
    expect(obj.host).toEqual('mongohost:27017')
    expect(obj.db).toEqual('somedb')
  })

  it('should not expose protocol property', () => {
    const obj = unpackMongodbConfig('no-env-exists', testURI)
    expect(obj.protocol).toEqual(undefined)
  })

  it('should not accept wrong protocol', () => {
    let theErr
    try {
      unpackMongodbConfig('no-env-exists', failProtocol)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.toEqual(undefined)
  })
})
