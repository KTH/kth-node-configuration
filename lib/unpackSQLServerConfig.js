'use strict'

/*
  Unpacks URI for local Sqlite config.

  Example: file://path/to/your/sqlite.db
*/

const parseUri = require('./parseUri')
const { getEnv } = require('./utils')

const _isCorrectURI = (parsedUri) => /^mssql/.test(parsedUri.protocol)

module.exports.canUnpack = _isCorrectURI

module.exports.unpack = (envVarName, defaultUri) => {
  const parsedUri = parseUri(getEnv(envVarName, defaultUri))

  if (!_isCorrectURI(parsedUri)) {
    throw new Error('MSSQL URI protocol must be mssql, got: ' + parsedUri.protocol)
  }

  const tmp = parsedUri.path.split('/')

  const outp = {
    dbName: tmp[tmp.length - 1],
    instanceName: tmp.length > 2 ? tmp[1] : undefined,
    username: parsedUri.username,
    dialect: 'mssql',
    host: parsedUri.hostname,
    port: parsedUri.port,
    // Pool added by unpackSequilizeConfig
    dialectOptions: {
      encrypt: true
    }
  }

  return outp
}
