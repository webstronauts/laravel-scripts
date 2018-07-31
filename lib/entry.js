/* global context, dispatch */
const interopDefault = m => (m && m.default ? m.default : m)
const render = interopDefault(require('entrypoint'))

if (typeof render === 'function') {
  Promise.resolve(render(context)).then(rendered => dispatch(rendered))
}
