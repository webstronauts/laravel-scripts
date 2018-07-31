/* global context, dispatch */
const interopDefault = m => (m && m.default ? m.default : m)

const render = interopDefault(require('liftoff-entrypoint'))
const manifest = interopDefault(require('liftoff-manifest'))

if (typeof render === 'function') {
  Promise.resolve(render(Object.assign({manifest}, context))).then(rendered =>
    dispatch(rendered),
  )
}
