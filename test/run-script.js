const path = require('path')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const slash = require('slash')
const spawn = require('cross-spawn')
const test = require('ava')

const projectRoot = path.join(__dirname, '../')

function normalizeArgs(args) {
  return args.map(arg => {
    return Array.isArray(arg)
      ? normalizeArgs(arg)
      : slash(arg.replace(projectRoot, '<PROJECT_ROOT>/'))
  })
}

test.beforeEach(t => {
  t.context.exit = sinon.stub(process, 'exit')
  t.context.log = sinon.stub(console, 'log')
  t.context.sync = sinon.stub(spawn, 'sync')
})

test.afterEach.always(t => {
  t.context.exit.restore()
  t.context.log.restore()
  t.context.sync.restore()
})

function spawnMacro(
  t,
  {snapshotLog = false, throws = false, signal = false, args = []},
) {
  try {
    process.argv = ['node', '../lib', ...args]

    if (signal) {
      t.context.sync.returns({result: 1, signal})
    } else {
      t.context.sync.returns({status: 0})
    }

    proxyquire('../lib/run-script', {'cross-spawn': {sync: t.context.sync}})

    if (snapshotLog) {
      t.snapshot(normalizeArgs(console.log.args))
    } else if (signal) {
      t.true(process.exit.calledOnce)
      t.true(process.exit.calledWith(1))
      t.snapshot(normalizeArgs(console.log.args))
    } else {
      t.true(t.context.sync.calledOnce)
      const [firstCall] = t.context.sync.args
      const [script, calledArgs] = firstCall
      t.snapshot(normalizeArgs([script, ...calledArgs]).join(' '))
    }
  } catch (err) {
    if (!throws) {
      throw err
    }

    t.snapshot(err.message)
  }
}

test('calls node with the script path and args', spawnMacro, {
  args: ['test', '--no-watch'],
})

test('throws unknown script', spawnMacro, {
  args: ['unknown-script'],
  throws: true,
})

test('logs help with no args', spawnMacro, {snapshotLog: true})

test('logs for SIGKILL signal', spawnMacro, {
  args: ['start'],
  signal: 'SIGKILL',
})

test('logs for SIGTERM signal', spawnMacro, {
  args: ['build'],
  signal: 'SIGTERM',
})

test('does not log for other signals', spawnMacro, {
  args: ['test'],
  signal: 'SIGBREAK',
})
