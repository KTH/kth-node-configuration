'use strict'

const _ = require('lodash')

const defaults = {
  dev: {},
  ref: {},
  prod: {},
  defaults: {},
  local: {}
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
