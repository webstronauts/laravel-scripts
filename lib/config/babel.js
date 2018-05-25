module.exports = function() {
  const preset = {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          modules: false,
        },
      ],
      require.resolve('@babel/preset-react'),
    ],
    plugins: [
      [
        require.resolve('@babel/plugin-proposal-class-properties'),
        {
          loose: true,
        },
      ],
      [
        require.resolve('@babel/plugin-proposal-object-rest-spread'),
        {
          useBuiltIns: true,
        },
      ],
      require.resolve('@babel/plugin-transform-runtime'),
      require.resolve('@babel/plugin-syntax-dynamic-import'),
    ],
  }

  const env = process.env.BABEL_ENV || process.env.NODE_ENV

  if (env !== 'development' && env !== 'test' && env !== 'production') {
    throw new Error(
      'Using `@webstronauts/laravel-scripts/babel` requires that you specify `NODE_ENV` or ' +
        '`BABEL_ENV` environment variables. Valid values are "development", ' +
        '"test", and "production". Instead, received: ' +
        JSON.stringify(env) +
        '.',
    )
  }

  if (env === 'development' || env === 'test') {
    preset.plugins.push(
      // Adds component stack to warning messages
      require.resolve('@babel/plugin-transform-react-jsx-source'),
    )
  }

  if (env === 'test') {
    preset.plugins.push(
      // Compiles import() to a deferred require()
      require.resolve('babel-plugin-dynamic-import-node'),
      // Transform ES modules to commonjs for Jest support
      require.resolve('@babel/plugin-transform-modules-commonjs'),
    )
  }

  if (env === 'production') {
    preset.plugins.push(
      require.resolve('babel-plugin-transform-react-remove-prop-types'),
    )
  }

  return preset
}
