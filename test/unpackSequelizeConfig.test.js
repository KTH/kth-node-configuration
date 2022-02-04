/* eslint-disable no-unused-expressions */
/* eslint-env mocha */

'use strict'

const unpackSequelizeConfig = require('../lib/unpackSequelizeConfig')

const testURI = 'sqlite://path/to/my/db/database.sqlite'
const failProtocol = 'smurf://path/to/my/db/database.sqlite'

describe('unpackSequelizeConfig', () => {
  process.env.password = 'password'

  it('can decode a Sequelize config from fallback URI', () => {
    const obj = unpackSequelizeConfig('no-env-exists', 'password', testURI)
    expect(obj.dialect).toEqual('sqlite')
    expect(obj.storage).not.toBeNull()
  })

  it('can decode a Sequelize config from env var', () => {
    process.env.TEST_ENV_NOW_HERE = testURI
    const obj = unpackSequelizeConfig('TEST_ENV_NOW_HERE', 'PWD')
    expect(obj.dialect).toEqual('sqlite')
    expect(obj.storage).not.toBeNull()
  })

  it('can override pool config', () => {
    process.env.TEST_ENV_NOW_HERE = testURI
    const obj = unpackSequelizeConfig('TEST_ENV_NOW_HERE', 'password', undefined, {
      pool: { max: 1 }
    })
    expect(obj.pool.max).toEqual(1)
  })

  it('should fetch password', () => {
    process.env.PWD = 'mypassword'
    const obj = unpackSequelizeConfig('no-env-exists', 'PWD', testURI)
    expect(obj.password).toEqual('mypassword')
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
