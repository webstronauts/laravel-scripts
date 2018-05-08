/* global context, dispatch */
const interopDefault = m => m && m.default ? m.default : m

const render = interopDefault(require('laravel-entrypoint'))
const manifest = interopDefault(require('laravel-manifest'))

if (typeof render === 'function') {
  Promise.resolve(render({ manifest, ...context })).then(rendered => dispatch(rendered))
}
