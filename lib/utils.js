const fs = require('fs')
const path = require('path')
const arrify = require('arrify')
const has = require('lodash.has')
const readPkgUp = require('read-pkg-up')
const paths = require('./config/paths')

const {pkg, path: pkgPath} = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
})

function envIsSet(name) {
  return (
    process.env.hasOwnProperty(name) &&
    process.env[name] &&
    process.env[name] !== 'undefined'
  )
}

function fromRoot(...p) {
  return path.join(paths.appPath, ...p)
}

function hasFile(...p) {
  return fs.existsSync(fromRoot(...p))
}

function hasPkgProp(props) {
  return arrify(props).some(prop => has(pkg, prop))
}

function parseEnv(name, def) {
  if (envIsSet(name)) {
    try {
      return JSON.parse(process.env[name])
    } catch (err) {
      return process.env[name]
    }
  }

  return def
}

module.exports = {
  envIsSet,
  fromRoot,
  hasFile,
  hasPkgProp,
  parseEnv,
}
