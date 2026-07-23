'use strict'

const parseUri = require('./parseUri')
const { getEnv } = require('./utils')
const unpackSqliteConfig = require('./unpackSqliteConfig')
const unpackSQLServerConfig = require('./unpackSQLServerConfig')

// TODO Make override possible
const defaultOptions = {
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
}

module.exports = (envVarName, envPassword, defaultUri, options) => {
  const parsedUri = parseUri(getEnv(envVarName, defaultUri))

  let outp

  if (unpackSqliteConfig.canUnpack(parsedUri)) {
    outp = unpackSqliteConfig.unpack(envVarName, defaultUri)
  } else if (unpackSQLServerConfig.canUnpack(parsedUri)) {
    outp = unpackSQLServerConfig.unpack(envVarName, defaultUri)
  } else {
    throw new Error('Sequelize could not handle protocol: ', parsedUri.protocol())
  }

  outp = Object.assign(outp, defaultOptions)

  // Add password to object
  outp.password = getEnv(envPassword)

  if (typeof options === 'object') {
    outp = Object.assign(outp, options)
  }

  return outp
}
