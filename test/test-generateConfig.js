/* eslint-env mocha */

'use strict'

const expect = require('chai').expect
const generateConfig = require('../lib/generateConfig')

describe('generateConfig', () => {
  it('can merge three config objects', () => {
    const conf1 = {
      a: 4,
      b: {
        c: 44
      }
    }
    const conf2 = {
      b: {
        d: '45',
        e: {
          f: 19
        }
      }
    }
    const conf3 = {
      a: 68,
      b: {
        e: {
          f: '112',
          g: 357
        }
      }
    }
    const obj = generateConfig([conf1, conf2, conf3])
    expect(obj).to.deep.equal({
      a: 68,
      b: {
        c: 44,
        d: '45',
        e: {
          f: '112',
          g: 357
        }
      },
      env: 'dev'
    })
  })
})
