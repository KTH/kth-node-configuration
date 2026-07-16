'use strict'

/*
  Unpacks URI for local Sqlite config.

  Example: file://path/to/your/sqlite.db
*/

const urlgrey = require('urlgrey')
const { getEnv } = require('./utils')

const _isSqlliteURI = (envObj) => /^sqlite/.test(envObj.protocol())

module.exports.canUnpack = _isSqlliteURI

module.exports.unpack = (envVarName, defaultUri) => {
  const envObj = urlgrey(getEnv(envVarName, defaultUri))

  if (!_isSqlliteURI(envObj)) {
    throw new Error('Sqlite URI protocol must be "sqlite", got: ' + envObj.protocol())
  }

  const outp = {
    host: 'localhost',
    dialect: 'sqlite',
    storage: '/' + envObj.hostname() + envObj.path()
  }

  return outp
}
