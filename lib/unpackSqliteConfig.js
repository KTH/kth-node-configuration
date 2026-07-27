'use strict'

/*
  Unpacks URI for local Sqlite config.

  Example: file://path/to/your/sqlite.db
*/

const parseUri = require('./parseUri')
const { getEnv } = require('./utils')

const _isSqlliteURI = (parsedUri) => /^sqlite/.test(parsedUri.protocol)

module.exports.canUnpack = _isSqlliteURI

module.exports.unpack = (envVarName, defaultUri) => {
  const parsedUri = parseUri(getEnv(envVarName, defaultUri))

  if (!_isSqlliteURI(parsedUri)) {
    throw new Error('Sqlite URI protocol must be "sqlite", got: ' + parsedUri.protocol)
  }

  const outp = {
    host: 'localhost',
    dialect: 'sqlite',
    storage: '/' + parsedUri.hostname + parsedUri.path
  }

  return outp
}
