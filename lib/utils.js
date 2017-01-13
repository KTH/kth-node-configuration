'use strict'

module.exports.getEnv = function (name, defaultVal) {
  return process.env[name] || defaultVal
}

module.exports.typeConversion = function (inp) {
  if (parseInt(inp).toString === inp) {
    return parseInt(inp)
  } else if (inp === 'true') {
    return true
  } else if (inp === 'false') {
    return false
  } else if (inp === 'undefined') {
    return undefined
  } else {
    return inp
  }
}
