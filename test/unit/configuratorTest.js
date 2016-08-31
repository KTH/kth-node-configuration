'use strict'

const path = require('path')
const test = require('tape')

// You can safely use dotenv to set environment variables.
// Just make sure you do not check in the .env file to source control.
require('dotenv').config({ path: path.join(__dirname, 'config/.env') })

const configurator = require('../../configurator')

// get config files
// const devConfig = require('./config/dev')
const refConfig = require('./config/ref')
// const prodConfig = require('./config/prod')
const localConfig = require('./config/local')
const defaultsConfig = require('./config/defaults')

function create () {
  return configurator({
    // prod: prodConfig,
    // dev: devConfig,
    ref: refConfig,
    defaults: defaultsConfig,
    local: localConfig
  })
}

test('falls back to default value', (assert) => {
  const config = create()
  const full = config.full()
  const expected = 'configuration-ref'
  assert.equal(full.name, expected, 'should equal ref name setting')
  assert.end()
})

test('hides secure options', (assert) => {
  const config = create()
  const safe = config.safe()
  const expected = { secure: {}, name: 'configuration-ref', common: 'app-name' }
  assert.deepEqual(safe, expected, 'should equal ref safe settings')
  assert.end()
})

test('gets only secure options', (assert) => {
  const config = create()
  const secure = config.secure()
  const expected = { mongodb: { url: 'mongodb://localhost/test' }, session: process.env.SESSION_SECRET }
  assert.deepEqual(secure, expected, 'should equal ref secure settings')
  assert.end()
})

test('gets correct environment', (assert) => {
  const config = create()
  const env = config.env()
  const full = config.full()
  const expectedName = 'configuration-ref'
  const expectedEnv = 'ref'
  const expectedSession = 'ref-secret'
  const expectedCommon = 'app-name'
  assert.equal(full.name, expectedName, 'should equal ref name setting')
  assert.equal(env, expectedEnv, 'should equal ref environment')
  assert.equal(full.secure.session, expectedSession, 'should equal session setting')
  assert.equal(full.common, expectedCommon, 'should use default common setting')
  assert.end()
})
