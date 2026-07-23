'use strict'

const parseUri = require('./parseUri')
const { getEnv } = require('./utils')

module.exports = (envVarName, defaultUri) => parseUri(getEnv(envVarName, defaultUri))
