/* eslint-env mocha */
'use strict'
const expect = require('chai').expect
const unpackApiKeysConfig = require('../lib/unpackApiKeysConfig')

const testURISingle = '?name=devClient&apiKey=1234&scope=write&scope=read'
const testURIDouble = '?name=devClient&apiKey=1234&scope=write&scope=read ?name=other&apiKey=5678&scope=read'

describe('unpackApiKeysConfig', function () {
  it('can decode a single API key', function () {
    const obj = unpackApiKeysConfig('no-env-exists', testURISingle)
    expect(obj[0].name).to.equal('devClient')
    expect(obj[0].apiKey).to.equal('1234')
    expect(obj[0].scope[0]).to.equal('write')
    expect(obj[0].scope.length).to.equal(2)
  })

  it('can decode two API keys', function () {
    const obj = unpackApiKeysConfig('no-env-exists', testURIDouble)
    expect(obj[1].name).to.equal('other')
    expect(obj[1].apiKey).to.equal('5678')
    expect(obj[1].scope[0]).to.equal('read')
  })
})
