# kth-node-configuration

Configuration module for Node.js projects.

## Usage

```javascript
const configurator = require('kth-node-configuration')

const config = configurator({
  defaults: require('./config/defaults'),
  dev: require('./config/dev'),
  prod: require('./config/prod'),
  ref: require('./config/ref'),
  local: require('./config/local')
})

module.exports = {
  full: config.full(),
  secure: config.secure(),
  safe: config.safe(),
  env: config.env()
}
```

## Options

- `defaults` should contain settings that will apply if no other config
  file has it set. It's recommended that this file contains a "skeleton"
  for the secure settings to document what the local settings can set.
- `dev`, `ref`, and `prod` should contain environment specific settings.
  They will override the defaults. The configurator selects this file
  depending on the `process.env.NODE_ENV` variable.
- `local` should contain settings that either shouldn't be checked into
  source control or local overrides specific to the machine running the
  app.   

## API

- `full()` returns the fully merged configuration.
- `secure()` returns only the secure merged configuration.
- `safe()` returns the fully merged configuration with the secure
  section blanked out. This should be safe to use on the client-side.
- `env()` returns the current enviroment setting. Will be one of the
  following: `dev`, `ref`, or `prod`.

## Pro-tip!

Use the [npm package __dotenv__][dotenv] to set environment variables.
Take a look at the unit tests for example usage.

[dotenv]: https://www.npmjs.com/package/dotenv

## DEV NOTES ##

- vi fimpar local-/prod-/ref-/devSettings.js
  - läggs i commonSettings.js, serverSettings.js, browserSettings.js

- fimpa full, safe och secure

När vi skapar nya settings-objektet
- vi mergear commonSettings.js + serverSettings.js till servern
- vi mergear commonSettings.js + browserSettings.js till browsern
  - returneras på endpointen ./browserConfig som javascript
  TODO: - lägg till script-tag i början av all layout-filer

## Migrating from <= 1.0.1

- convert ...Settings.js files to:

  - commonSettings.js -- shared by browser and server
  - serverSettings.js -- server specific settings that should NEVER be sent to a browser
  - browserSettings.js -- browser specific settings that are passed to browser

- Search and replace:

  require('../**/configuration') => require('../**/configuration').server

  config.full => config
  config.safe => config
  config.secure: .secure => ''
  server.full => server

- What are these used for (kth-node-configuration)

  module.exports.getEnv = _env
  module.exports.getEnvString = _str
  module.exports.getEnvBool = _bool
  module.exports.getEnvInt = _int

- Update tests

  config.full => config

- change how we start server:

  kth-node-server@1.x:

    server.setConfig(config) => server.setConfig({ full: config })

  kth-node-server@3.x

    // Check docs for that release

- change in adldap.js (only if we use ldap)

  attributes: config.ldapClient.userattrs => attributes: config.ldap.userattrs
  config.ldapClient.filterReplaceHolder, kthid => config.ldap.filterReplaceHolder, kthid

- change configuration.js

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
NOTE: Browser settings are only needed in node-web (frontend) projects

- add dependency to dotenv and have it load your .env-file on startup. server.js should start like this:

```javascript
const server = require('kth-node-server')
// Load .env file in development mode
const nodeEnv = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()
if (nodeEnv === 'development' || nodeEnv === 'dev' || !nodeEnv) {
  require('dotenv').config()
}
// Now read the server config
const config = require('./init/configuration').server
```

- make sure configuration/index.js has the following export:

```javascript
module.exports = require('./configuration')
```

### The following steps only for frontend

- Add endpoint .../browserConfig to staticFiles.js (earlier name: routing.js)

```javascript
const paths = require('../routing/paths')
const browserConfig = require('../configuration').browser
const browserConfigHandler = require('kth-node-configuration').getHandler(browserConfig, paths)

...

// Expose browser configurations
server.use(config.proxyPrefixPath.uri + '/static/browserConfig', browserConfigHandler)
```

- add a line of code to load handlebars-helpers in server.js

```javascript
// Register handlebar helpers
require('./views/helpers')
```

- Remove the handlebars helper if you have one

```hbs
  <<globalSettingsForBrowserJS>>
```

- remove /buildConfig.js

- remove npm script `"buildConfig"` and also remove call to it from `"postinstall"`-hook

- Change config imports in js-files

	var config = require('config') => var config = { config: window.config, paths: window.paths }

- include config in head, should look like this

```hbs
{{prefixScript '/static/js/vendor.js' 'head-scripts'}}
{{prefixScript '/static/browserConfig' 'head-scripts'}}
```

## TODO ##
TODO - add test for decodeUri.js
TODO - add test for utils.js
TODO - add test for unpackLDAPConfig.js
TODO - add test for generateConfig.js
TODO - add test for getHandler.js

## DONE ##
DONE - add test for unpackNodeApiConfig.js
DONE - add test for unpackMongodbConfig.js
DONE - add test for unpackRedisConfig.js
