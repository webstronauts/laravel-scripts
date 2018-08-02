const spawn = require('cross-spawn')
const {
  fromHere,
  hasFile,
  resolveBin,
  resolveDirectoryArgs,
} = require('../utils')

let args = process.argv.slice(2)

const useBuiltinConfig =
  !args.includes('--config') && !hasFile('webpack.config.js')
const config = useBuiltinConfig
  ? ['--config', fromHere('./config/webpack.js')]
  : []

const env =
  args.includes('--env.production') || args.includes('--env.development')
    ? []
    : ['--env.development']

const dirs = Object.entries(resolveDirectoryArgs(args)).reduce(
  (dirs, [dir, path]) => [...dirs, `--env.${dir}`, path],
  [],
)

const result = spawn.sync(
  resolveBin('webpack-cli', {executable: 'webpack-cli'}),
  [...config, ...env, ...dirs].concat(args),
  {stdio: 'inherit'},
)

process.exit(result.status)
