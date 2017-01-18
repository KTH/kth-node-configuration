/* eslint-env mocha */
'use strict'
const expect = require('chai').expect
const unpackRedisConfig = require('../lib/unpackRedisConfig')

const testURI = 'redis://localhost:6379/'
const testURIWithSSL = 'redis://localhost:6379/?auth_pass=abcdefghij&ssl=true'

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
    expect(obj.auth_pass).to.equal('abcdefghij')
    expect(obj.tls.servername).to.equal('localhost')
  })
})
