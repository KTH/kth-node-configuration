// Contains common configuration that could be used in any environment.
// This is the first file that is processed and can be overridden by
// environment files and local settings.
module.exports = {
  secure: {
    mongodb: {
      url: ''
    },

    session: ''
  },

  common: 'app-name',
  name: 'configuration'
}
