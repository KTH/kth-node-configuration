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
    (eller kan vi referera den från JS-filen?)

Migrering:

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

- Update kth-node-server (to 1.2.0)

  config.full => config

- change how we start server:

    server.setConfig(config) => server.setConfig({ full: config })

- change in adldap.js

  attributes: config.ldapClient.userattrs => attributes: config.ldap.userattrs
  config.ldapClient.filterReplaceHolder, kthid => config.ldap.filterReplaceHolder, kthid

- Add endpoint .../browserConfig
- Remove the handlebars helper

  <<globalSettingsForBrowserJS>>

- remove /buildConfig.js

- remove npm script `"buildConfig"` and also remove call to it from `"postinstall"`-hook

- Change config imports in js-files

	var config = require('config') => var config = { config: window.config, paths: window.paths }
