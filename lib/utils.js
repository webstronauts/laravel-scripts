const fs = require('fs')
const path = require('path')
const arrify = require('arrify')
const has = require('lodash.has')
const readPkgUp = require('read-pkg-up')
const which = require('which')
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

function fromHere(...p) {
  return path.join(paths.ownPath, ...p)
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

function resolveBin(modName, {executable = modName, cwd = process.cwd()} = {}) {
  let pathFromWhich

  try {
    pathFromWhich = fs.realpathSync(which.sync(executable))
  } catch (_error) {
    // ignore _error
  }

  try {
    const modPkgPath = require.resolve(`${modName}/package.json`)
    const modPkgDir = path.dirname(modPkgPath)
    const {bin} = require(modPkgPath)
    const binPath = typeof bin === 'string' ? bin : bin[executable]
    const fullPathToBin = path.join(modPkgDir, binPath)

    if (fullPathToBin === pathFromWhich) {
      return executable
    }

    return fullPathToBin.replace(cwd, '.')
  } catch (error) {
    if (pathFromWhich) {
      return executable
    }

    throw error
  }
}

function resolveDirectoryArgs(args) {
  const dirs = {
    rootDir: paths.appPath,
    srcDir: paths.assetsPath,
    outputDir: paths.appPublic,
  }

  if (args.includes('--root-dir')) {
    const [, rootDir] = args.splice(args.indexOf('--root-dir'), 2)
    dirs.rootDir = rootDir
  }

  if (args.includes('--src-dir')) {
    const [, srcDir] = args.splice(args.indexOf('--src-dir'), 2)
    dirs.srcDir = srcDir
  }

  if (args.includes('--output-dir')) {
    const [, outputDir] = args.splice(args.indexOf('--output-dir'), 2)
    dirs.outputDir = outputDir
  }

  return dirs
}

module.exports = {
  envIsSet,
  fromHere,
  fromRoot,
  hasFile,
  hasPkgProp,
  parseEnv,
  resolveBin,
  resolveDirectoryArgs,
}
