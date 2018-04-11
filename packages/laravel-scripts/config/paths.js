const fs = require('fs')
const path = require('path')

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())

const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
const resolveAsset = relativePath => path.resolve(appDirectory, 'resources/assets', relativePath)
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath)

module.exports = {
  appPath: resolveApp('.'),
  appEnvPath: resolveApp('.env'),
  appPublic: resolveApp('public'),
  appPublicCss: resolveApp('public/css'),
  appPublicJs: resolveApp('public/js'),
  appPublicManifest: resolveApp('public/mix-manifest.json'),
  appLiftoffConfig: resolveApp('liftoff.config.js'),
  appNodeModules: resolveApp('node_modules'),
  appPackageJson: resolveApp('package.json'),
  assetsPath: resolveAsset('.'),

  serverEntry: resolveAsset('js/entry-server'),
  clientEntry: resolveAsset('js/entry-client'),

  testsSetup: resolveAsset('js/setupTests.js'),

  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules')
}
