'use strict'

/*
  Unpacks URI for local Sqlite config.

  Example: file://path/to/your/sqlite.db
*/

const { getEnv, typeConversion } = require('./utils')
const urlgrey = require('urlgrey')

const _isSqlliteURI = (envObj) => /^file/.test(envObj.protocol())

module.exports.canUnpack = _isSqlliteURI

module.exports.unpack = function (envVarName, defaultUri) {
  const envObj = urlgrey(getEnv(envVarName, defaultUri))
  const uri = getEnv(envVarName, defaultUri)

  if (! _isSqlliteURI(envObj)) {
    throw new Error('Sqlite URI protocol must be file, got: ' + envObj.protocol())
  }

  const outp = {
    host: 'localhost',
    dialect: 'sqlite',
    storage: '/' + envObj.hostname() + envObj.path()
  }

  return outp
}
