const babelJest = require('babel-jest')
const babelConfig = require('../../babel')

module.exports = babelJest.createTransformer(babelConfig())
