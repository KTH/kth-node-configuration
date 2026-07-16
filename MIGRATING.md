# Migrating from <= 1.0.1

- convert ...Settings.js files to:
  - commonSettings.js -- shared by browser and server
  - serverSettings.js -- server specific settings that should NEVER be sent to a browser
  - browserSettings.js -- browser specific settings that are passed to browser

- Search and replace:

```
  require('../**/configuration') => require('../**/configuration').server
```

- config.full => config
- config.safe => config
- [xxx].secure => [xxx]
- server.full => server

- What are these used for (kth-node-configuration)
  - module.exports.getEnv = \_env
  - module.exports.getEnvString = \_str
  - module.exports.getEnvBool = \_bool
  - module.exports.getEnvInt = \_int
  - module.exports.devDefaults = \_str

- Update tests

  config.full => config

- change how we start server:

  kth-node-server@1.x:

  server.setConfig(config) => server.setConfig({ full: config })

  kth-node-server@3.x:

```javascript
server.start({
  pfx: config.ssl.pfx,
  passphrase: config.ssl.passphrase,
  key: config.ssl.key,
  ca: config.ssl.ca,
  cert: config.ssl.cert,
  port: config.port,
  logger: log // Your logging service, could be console or kth-node-log
})
```

- change in adldap.js (only if we use ldap)
  - attributes: config.ldapClient.userattrs => attributes: config.ldap.userattrs
  - config.ldapClient.filterReplaceHolder, kthid => config.ldap.filterReplaceHolder, kthid

- change configuration.js (examples for node-web and node-api apps)

_app.js_
Edit app.js to look like this:

```javascript
'use strict'

const server = require('./server/server')
require('./server/init')
```

_NODE-WEB:_

```javascript
'use strict'
const { generateConfig } = require('kth-node-configuration')

// These settings are used by the server
const serverConfig = generateConfig([
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

In adldap.js you need to change:

- config.ldapClient => config.ldap

And move any config settings from ldapClient object to ldap object.

_NODE-API:_

```javascript
'use strict'
const { generateConfig } = require('kth-node-configuration')

// These settings are used by the server
const serverConfig = generateConfig([require('../../../config/serverSettings')])

module.exports.server = serverConfig
```

- make sure configuration/index.js has the following export:

```javascript
module.exports = require('./configuration')
```

## The following steps only for frontend

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
