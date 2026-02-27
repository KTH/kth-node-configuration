const unpackSequelizeConfig = require('../lib/unpackSequelizeConfig')

const testPathToFile = 'path/to/my/db/database.sqlite'
const testURI = 'sqlite://' + testPathToFile
const failProtocol = 'http://path/to/my/db/database.sqlite'
const correctPathToFile = '/' + testPathToFile

describe('unpackSqliteConfig', () => {
  process.env.password = 'password'

  it('can decode a SQLite config from fallback URI', () => {
    const obj = unpackSequelizeConfig('no-env-exists', 'password', testURI)
    expect(obj.dialect).toEqual('sqlite')
    expect(obj.storage).toEqual(correctPathToFile)
  })

  it('can decode a Sequelize config from env var', () => {
    process.env.TEST_ENV_NOW_HERE = testURI
    const obj = unpackSequelizeConfig('TEST_ENV_NOW_HERE', 'password')
    expect(obj.dialect).toEqual('sqlite')
    expect(obj.storage).toEqual(correctPathToFile)
  })

  it('should not expose protocol property', () => {
    const obj = unpackSequelizeConfig('no-env-exists', 'password', testURI)
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
