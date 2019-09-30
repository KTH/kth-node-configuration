'use strict'

const { getEnv } = require('./utils')
const urlgrey = require('urlgrey')

module.exports = (envVarName, defaultUri) => {
  return urlgrey(getEnv(envVarName, defaultUri))
}
