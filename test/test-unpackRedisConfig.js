/* eslint-env mocha */
'use strict'
const expect = require('chai').expect
const unpackRedisConfig = require('../lib/unpackRedisConfig')

const testURI = 'redis://localhost:6379/'
const testURIWithSSL = 'redis://:4W6ZrQuA6QvDrup2DIryb8hTPIrYGzx0ersukRaT+is=@localhost:6379/?ssl=true'
const failProtocol = 'wrong://'

describe('unpackRedisConfig', function () {
  it('can decode a Redis URI from fallback URI', function () {
    const obj = unpackRedisConfig('no-env-exists', testURI)
    expect(obj.host).to.equal('localhost')
    expect(obj.port).to.equal(6379)
  })

  it('can decode a Redis URI from env var', function () {
    process.env['TEST_ENV_NOW_HERE'] = testURI
    const obj = unpackRedisConfig('TEST_ENV_NOW_HERE')
    expect(obj.host).to.equal('localhost')
    expect(obj.port).to.equal(6379)
  })

  it('can decode a Redis URI from fallback URI and merge with options', function () {
    const obj = unpackRedisConfig('no-env-exists', testURI, { extraOption: true })
    expect(obj.host).to.equal('localhost')
    expect(obj.port).to.equal(6379)
    expect(obj.extraOption).to.equal(true)
  })

  it('should not expose protocol property', function () {
    const obj = unpackRedisConfig('no-env-exists', testURI)
    expect(obj.protocol).to.equal(undefined)
  })

  it('can handle ssl for Azure', function () {
    const obj = unpackRedisConfig('no-env-exists', testURIWithSSL)
    expect(obj.auth_pass).to.equal('4W6ZrQuA6QvDrup2DIryb8hTPIrYGzx0ersukRaT+is=')
    expect(obj.tls.servername).to.equal('localhost')
  })

  it('should not accept wrong protocol', function () {
    var theErr
    try {
      unpackRedisConfig('no-env-exists', failProtocol)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.to.equal(undefined)
  })
})
