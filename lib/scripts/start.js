const spawn = require('cross-spawn')
const {fromHere, hasFile, resolveBin} = require('../utils')

const args = process.argv.slice(2)

const useBuiltinConfig =
  !args.includes('--config') && !hasFile('webpack.config.js')
const config = useBuiltinConfig
  ? ['--config', fromHere('./config/webpack.js')]
  : []

const env = args.includes('--env') ? [] : ['--env', 'development']

const result = spawn.sync(
  resolveBin('webpack-cli', {executable: 'webpack-cli'}),
  [...config, ...env].concat(args),
  {stdio: 'inherit'},
)

process.exit(result.status)
