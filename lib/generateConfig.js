'use strict'

function deepAssign(target, ...sources) {
  sources.forEach((source) => {
    const isObject = (obj) => obj && typeof obj === 'object'
    if (!isObject(target) || !isObject(source)) return source
    Object.keys(source).forEach((key) => {
      if (Array.isArray(target[key]) && Array.isArray(target[key]))
        target[key] = target[key].concat(source[key])
      else if (isObject(target[key]) && isObject(source[key]))
        target[key] = deepAssign(Object.assign({}, target[key]), source[key])
      else target[key] = source[key]
    })
  })
  return target
}

function _currentNodeEnv() {
  const nodeEnv = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()

  if (nodeEnv === 'production' || nodeEnv === 'prod') {
    return 'prod'
  } else if (nodeEnv === 'referens' || nodeEnv === 'reference' || nodeEnv === 'ref') {
    return 'ref'
  } else if (nodeEnv === 'development' || nodeEnv === 'dev' || !nodeEnv) {
    return 'dev'
  }

  // To run Node in production mode NODE_currentNodeEnv must be 'production'
  throw new Error(`Invalid NODE_currentNodeEnv variable: ${nodeEnv}`)
}

module.exports = (inpArr) => {
  // Create array of source objects
  const mergeThese = inpArr.slice()
  // Add target object
  const mergedObj = {}
  mergeThese.unshift(mergedObj)
  // Merge all objects
  deepAssign.apply(this, mergeThese)
  // Add the env variable
  mergedObj.env = _currentNodeEnv()

  return mergedObj
}
