// @TODO Move this to a separate package
module.exports = {
  presets: [
    [require.resolve('@babel/preset-env'), {
      'modules': false
    }],
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-stage-2')
  ],
  env: {
    test: {
      plugins: [
        require.resolve('@babel/plugin-transform-modules-commonjs')
      ]
    }
  }
}
