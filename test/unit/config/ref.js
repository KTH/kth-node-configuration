// This file contains environment specific configuration that can be in
// source control. Note the process.env.MONGODB_URL usage! Settings here
// can still be overridden in the local file.
module.exports = {
  secure: {
    mongodb: {
      url: process.env.MONGODB_URL
    },

    session: process.env.SESSION_SECRET
  },

  name: 'configuration-ref'
}
