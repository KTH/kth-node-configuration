// Contains configuration that should not be in source control. Anything
// in here will override settings in the other files.
module.exports = {
  secure: {
    mongodb: {
      url: 'mongodb://localhost/test'
    }
  }
}
