/* eslint-env mocha */
'use strict'
const expect = require('chai').expect
const unpackSequelizeConfig = require('../lib/unpackSequelizeConfig')

const testPathToFile = 'path/to/my/db/database.sqlite'
const testURI = 'file://' + testPathToFile
const failProtocol = 'http://path/to/my/db/database.sqlite'
const correctPathToFile = '/' + testPathToFile

describe('unpackSqliteConfig', function () {
  it('can decode a Sqlite config from fallback URI', function () {
    const obj = unpackSequelizeConfig('no-env-exists', testURI)
    expect(obj.dialect).to.equal('sqlite')
    expect(obj.storage).to.equal(correctPathToFile)
  })

  it('can decode a Sequelize config from env var', function () {
    process.env['TEST_ENV_NOW_HERE'] = testURI
    const obj = unpackSequelizeConfig('TEST_ENV_NOW_HERE')
    expect(obj.dialect).to.equal('sqlite')
    expect(obj.storage).to.equal(correctPathToFile)
  })

  it('should not expose protocol property', function () {
    const obj = unpackSequelizeConfig('no-env-exists', testURI)
    expect(obj.protocol).to.equal(undefined)
  })

  it('should not accept wrong protocol', function () {
    var theErr
    try {
      unpackSequelizeConfig('no-env-exists', failProtocol)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.to.equal(undefined)
  })
})
