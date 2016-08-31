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
