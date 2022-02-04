/* eslint-env mocha */

'use strict'

const unpackApiKeysConfig = require('../lib/unpackApiKeysConfig')

const uriOne = '?name=devClient&apiKey=1234&scope=write&scope=read'
const uriTwo = '?name=other&apiKey=5678&scope=read'

describe('unpackApiKeysConfig', () => {
  it('can decode a single API key', () => {
    process.env.API_KEY = uriOne

    const obj = unpackApiKeysConfig('API_KEY', undefined)
    expect(obj[0].name).toEqual('devClient')
    expect(obj[0].apiKey).toEqual('1234')
    expect(obj[0].scope[0]).toEqual('write')
    expect(obj[0].scope.length).toEqual(2)

    process.env.API_KEY = undefined
  })

  it('can decode two API keys', () => {
    process.env.API_KEY_0 = uriOne
    process.env.API_KEY_1 = uriTwo

    const obj = unpackApiKeysConfig('API_KEY', undefined)

    expect(obj[0].name).toEqual('devClient')
    expect(obj[0].apiKey).toEqual('1234')
    expect(obj[0].scope[0]).toEqual('write')
    expect(obj[0].scope[1]).toEqual('read')
    expect(obj[0].scope.length).toEqual(2)
    expect(obj[1].name).toEqual('other')
    expect(obj[1].apiKey).toEqual('5678')
    expect(obj[1].scope[0]).toEqual('read')

    process.env.API_KEY_0 = undefined
    process.env.API_KEY_1 = undefined
  })

  it('can fall back to default', () => {
    const obj = unpackApiKeysConfig('no-env-exists', uriOne)
    expect(obj[0].name).toEqual('devClient')
    expect(obj[0].apiKey).toEqual('1234')
    expect(obj[0].scope[0]).toEqual('write')
    expect(obj[0].scope.length).toEqual(2)
  })
})
