# Development Notes

- vi fimpar local-/prod-/ref-/devSettings.js
  - laggs i commonSettings.js, serverSettings.js, browserSettings.js

- fimpa full, safe och secure

Nar vi skapar nya settings-objektet

- vi mergear commonSettings.js + serverSettings.js till servern
- vi mergear commonSettings.js + browserSettings.js till browsern
  - returneras pa endpointen ./browserConfig som javascript
    TODO: - lagg till script-tag i borjan av all layout-filer

## TODO

- add test for decodeUri.js
- add test for utils.js
- add test for unpackLDAPConfig.js
- add test for generateConfig.js
- add test for getHandler.js

## DONE

- add test for unpackNodeApiConfig.js
- add test for unpackMongodbConfig.js
- add test for unpackRedisConfig.js
