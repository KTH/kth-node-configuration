'use strict'

const _ = require('lodash')

const defaults = {
  dev: {},
  ref: {},
  prod: {},
  defaults: {},
  local: {}
}

function _env (key, def) {
  let type = typeof def
  if (!process.env[key]) return def
  switch (type) {
    case 'boolean':
      return process.env[key] === 'true'
    case 'number':
      return parseInt(process.env[key], 10)
    default:
      return process.env[key]
  }
}

function _str (key, def) {
  return process.env[key] || def
}

function _bool (key, def) {
  if (process.env[key]) return process.env[key] === 'true'
  else return def
}

function _int (key, def) {
  return parseInt(process.env[key], 10) || def
}

module.exports = function (options) {
  options = _.merge({}, defaults, options)

  function _getLowerCaseNodeEnv () {
    return process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()
  }

  function _merged () {
    return _.merge({}, options.defaults, options[env()], options.local)
  }

  function _isProduction (nodeEnv) {
    return nodeEnv === 'produktion' || nodeEnv === 'production' || nodeEnv === 'prod'
  }

  function _isReference (nodeEnv) {
    return nodeEnv === 'referens' || nodeEnv === 'reference' || nodeEnv === 'ref'
  }

  function _isDevelopment (nodeEnv) {
    return nodeEnv === 'development' || nodeEnv === 'dev'
  }

  function env () {
    const nodeEnv = _getLowerCaseNodeEnv()

    if (_isProduction(nodeEnv)) {
      return 'prod'
    }

    if (_isReference(nodeEnv)) {
      return 'ref'
    }

    if (_isDevelopment(nodeEnv)) {
      return 'dev'
    }

    throw new Error(`Invalid NODE_ENV variable: ${nodeEnv}`)
  }

  return {
    env: env,

    full: function () {
      return _merged()
    },

    safe: function () {
      const full = this.full()
      full.secure = {}
      return full
    },

    secure: function () {
      return this.full().secure
    }
  }
}

module.exports.getEnv = _env
module.exports.getEnvString = _str
module.exports.getEnvBool = _bool
module.exports.getEnvInt = _int
