# Snapshot report for `test/run-script.js`

The actual snapshot is saved in `run-script.js.snap`.

Generated by [AVA](https://ava.li).

## calls node with the script path and args

> Snapshot 1

    'node <PROJECT_ROOT>/lib/scripts/test.js --no-watch'

## does not log for other signals

> Snapshot 1

    []

## logs for SIGKILL signal

> Snapshot 1

    [
      [
        'The script "start" failed because the process exited too early. This probably means the system ran out of memory or someone called `kill -9` on the process.',
      ],
    ]

## logs for SIGTERM signal

> Snapshot 1

    [
      [
        'The script "build" failed because the process exited too early. Someone might have called `kill` or `killall`, or the system could be shutting down.',
      ],
    ]

## logs help with no args

> Snapshot 1

    [
      [
        `␊
        Usage: ../lib [script] [--flags]␊
        Available Scripts:␊
          build␊
          start␊
          test␊
        Options:␊
          All options depend on the script. Docs will be improved eventually, but for most scripts you can assume that the args you pass will be forwarded to the respective tool that's being run under the hood.␊
        `,
      ],
    ]

## throws unknown script

> Snapshot 1

    `Unknown script "unknown-script".␊
    Perhaps you need to update @webstronauts/liftoff-scripts?`
