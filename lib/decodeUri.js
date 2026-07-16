'use strict'

const urlgrey = require('urlgrey')
const { getEnv } = require('./utils')

module.exports = (envVarName, defaultUri) => urlgrey(getEnv(envVarName, defaultUri))
