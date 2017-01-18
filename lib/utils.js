'use strict'
const { safeGet } = require('safe-utils')


module.exports.getEnv = function (name, defaultVal) {
  return process.env[name] || defaultVal
}

module.exports.typeConversion = function (inp) {
  if (parseInt(inp).toString === inp) {
    return parseInt(inp)
  } else if (safeGet(() => inp.toLowerCase() === 'true')) {
    return true
  } else if (safeGet(() => inp.toLowerCase() === 'false')) {
    return false
  } else if (inp === 'undefined') {
    return undefined
  } else {
    return inp
  }
}
