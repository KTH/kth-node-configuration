# kth-node-configuration

Configuration module for Node.js projects.

## Requirements

- Node.js >= 24

## Usage

### node-api projects

In node-api projects you only have a single settings file called serverSettings.js. Create your configuration by adding the following code:

```javascript
'use strict'
const { generateConfig } = require('kth-node-configuration')

// These settings are used by the server
const serverConfig = generateConfig([require('../../../config/serverSettings')])

module.exports.server = serverConfig
```

All options are available in this object.

### node-web projects

In node-web projects your settings are split in three files:

- commonSettings.js -- settings shared by browser and server (i.e. don't store any secrets here)
- browserSettings.js -- settings passed to the browser (i.e. don't store any secrets here either)
- serverSettings.js -- settings that are specific to the server

If you use LDAP you will also want to add default LDAP settings to your server config.

```javascript
'use strict'
const { generateConfig } = require('kth-node-configuration')
// The ldapDefaultSettings contains ldapClient defaults object
const ldapDefaultSettings = require('kth-node-configuration').unpackLDAPConfig.defaultSettings

// These settings are used by the server
const serverConfig = generateConfig([
  ldapDefaultSettings,
  require('../../../config/commonSettings'),
  require('../../../config/serverSettings')
])

module.exports.server = serverConfig

// These settings are passed to the browser
const browserConfig = generateConfig([
  require('../../../config/commonSettings'),
  require('../../../config/browserSettings')
])

module.exports.browser = browserConfig
```

### Helper methods

There are a couple of helper methods available to allow your settings files to be a bit more concise.

The env-vars should be on the same form as the default URI.

Options override any settings you pass through env-vars or defaults.

NOTE: the helper methods obey standard URI syntax. Any get params you add will be set as properties
on the config object.

#### Escaping

Don't forget to escape special characters such as:

- '&' in keys to '%26'
- '/' in usernames or passwords to '%2F'

#### unpackApiKeysConfig(ENV_VAR_NAME_URI, defaultURI)

This call returns an array of api access key objects.

```javascript
const defaultUri = '?name=devClient&apiKey=1234&scope=write&scope=read'
unpackApiKeysConfig('API_KEYS', defaultUri)
```

To define multiple API_KEYS you name each key as if it was a reference to an array. The unpacker will iterate from 0 and
add each item until it comes across a value that is undefined:

```
API_KEYS_0 = '?name=devClient&apiKey=1234&scope=write&scope=read'
API_KEYS_1 = '?name=devClient&apiKey=1234&scope=write&scope=read'
API_KEYS_2 = '?name=devClient&apiKey=1234&scope=write&scope=read'
```

#### unpackKOPPSConfig(ENV_VAR_NAME_URI, defaultURI [, options])

```javascript
const defaultUri = 'http://[hostname][:port][/path]?defaultTimeout=60000'
unpackKOPPSConfig('KOPPS_URI', defaultUri)
```

#### unpackLDAPConfig(ENV_VAR_NAME_URI, ENV_VAR_NAME_PASSWORD, defaultURI [, options])

```javascript
// Never hard code defaults to LDAP in settings, always pass through env-vars
// LDAP_URI = 'ldaps://[username]@[hostname]:[port]
// LDAP_PASSWORD = 'yadayada'
unpackLDAPConfig('LDAP_URI', 'LDAP_PASSWORD')
```

NOTE 1: Some default settings are always applied and can be overridden by passing options. Check source for defaults.

NOTE 2: Having a separate config.ldap and config.ldapClient configuration is deprecated, everything should be in config.ldap.

NOTE 3: unpackRedisConfig supports Azure connection string

#### unpackMongodbConfig(ENV_VAR_NAME_URI, defaultURI [, options])

```javascript
const defaultUri = 'mongodb://[hostname][:port][/path][?ssl=true]'
unpackMongodbConfig('MONGODB_URI', defaultUri)
```

#### unpackNodeApiConfig(ENV_VAR_NAME_URI, defaultURI [, options])

```javascript
const defaultUri = 'http[s]://[hostname][:port][/path][?required=true&defaultTimeout=10000]'
unpackNodeApiConfig('NODE_API_URI', defaultUri)
```

#### unpackRedisConfig(ENV_VAR_NAME_URI, defaultURI [, options])

```javascript
const defaultUri = 'redis://[hostname][:port]/'
unpackRedisConfig('REDIS_URI', defaultUri)
```

#### unpackSMTPConfig(ENV_VAR_NAME_URI, defaultURI [, options])

```javascript
// Never include username or password in default SMTP-config
const defaultUri = 'smtp://smtp.kth.se:25'
// SMTP_URI = smtp[s]://[username][:password]@[hostname]:[port]
unpackSMTPConfig('SMTP_URI', defaultUri)
```

#### unpackSequelizeConfig(ENV_VAR_NAME_URI, defaultURI [, options])

```javascript
// Never include username or password in default SMTP-config
const defaultSQLiteUri = 'sqlite://path/to/db.file'
// DB_URI = sqlite://[path/to/file]
const defaultSQLServerUri = 'mssql://username@db.test.com/InstanceName/DbName'
// DB_URI = mssql://[username][:password]@[hostname]:[port]/[DbInstance]/[DbName]
unpackSequelizeConfig('DB_URI', 'DB_PWD', defaultUri)
```

Examples of usage can be found in the node-api and node-web template projects.

## Additional docs

- Migration guide: [MIGRATING.md](MIGRATING.md)
