const unpackSequelizeConfig = require('../lib/unpackSequelizeConfig')

const testInstanceURI = 'mssql://username:password@db.test.com/InstanceName/DbName'
const testDbURI = 'mssql://username:password@db.test.com:1234/DbName'
const failProtocol = 'http://path/to/my/db/database.crap'

describe('unpackSQLServerConfig', () => {
  process.env.password = 'password'

  it('can decode a SQLServer config from fallback URI', () => {
    const obj = unpackSequelizeConfig('no-env-exists', 'password', testInstanceURI)
    expect(obj.dialect).toEqual('mssql')
    expect(obj.dbName).toEqual('DbName')
  })

  it('can decode a SQLServer config from env var', () => {
    process.env.TEST_ENV_NOW_HERE = testDbURI
    const obj = unpackSequelizeConfig('TEST_ENV_NOW_HERE', 'password')
    expect(obj.dialect).toEqual('mssql')
    expect(obj.dbName).toEqual('DbName')
    expect(obj.username).toEqual('username')
    expect(obj.host).toEqual('db.test.com')
    expect(obj.port).toEqual(1234)
  })

  it('should not expose protocol property', () => {
    const obj = unpackSequelizeConfig('no-env-exists', 'password', testDbURI)
    expect(obj.protocol).toEqual(undefined)
  })

  it('should not accept wrong protocol', () => {
    let theErr
    try {
      unpackSequelizeConfig('no-env-exists', 'password', failProtocol)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.toEqual(undefined)
  })
})
