import { program } from 'commander';
import cron from 'node-cron';

import { Commands } from '../src/commands/index.js';
import { Logger } from '../src/common/index.js';
import { CONFIG } from '../src/config/index.js';
import { sleep } from '../src/util/index.js';
import { handleError } from './handleError.js';
import { notifyUpdate } from './notifyUpdate.js';

// Repeat at XX:XX:00; used if no user/command-provided schedule.
const FALLBACK_REPEAT_CRON_EXPRESSION = '* * * * *';

// Options that can be saved with `login` or `config`.
const configurableOptions = [
  'exchange',
  'key',
  'secret',
  'subaccount',
  'colour',
  'updateNotifications',
  'reduceOnly',
  'ioc',
  'postOnly',
  'retry',
  'rateLimit',
];

function composeGlobalConfigOptions(inlineGlobalOptions) {
  return Object.fromEntries(
    configurableOptions.map((option) => [
      option,

      // Give priority to inline options, fall back to stored account/config.
      inlineGlobalOptions[option] ?? CONFIG.USER.get(option),
    ])
  );
}

function composeGlobalOptions() {
  const inlineGlobalOptions = program.opts();
  const globalConfigOptions = composeGlobalConfigOptions(inlineGlobalOptions);

  return {
    ...globalConfigOptions,
    schedule: inlineGlobalOptions.schedule,
  };
}

function composeOptions(inlineCommandOptions) {
  return {
    global: composeGlobalOptions(),
    command: inlineCommandOptions,
  };
}

function logWaiting() {
  Logger.info('Waiting for schedule trigger');
}

async function scheduleCommand(run, options) {
  if (options.global.schedule.type === 'date') {
    logWaiting();
    await sleep(options.global.schedule.millisecondsUntilDate);
    await run(options);

    return;
  }

  logWaiting();

  // TODO: Add method of ending schedule (e.g. `--schedule-end`).
  cron.schedule(options.global.schedule.cronExpression, () => {
    run(options);
    logWaiting();
  });
}

async function repeatRun(run, options, cronExpression) {
  // Schedule repeat runs.
  cron.schedule(cronExpression, async () => {
    await run(options);
  });

  // Execute initial run.
  await run(options);
}

async function runFunction(command, options) {
  const {
    run,
    DEFAULT_REPEAT_CRON_EXPRESSION = FALLBACK_REPEAT_CRON_EXPRESSION,
  } = Commands[command];

  if (options.global.schedule != null) {
    await scheduleCommand(run, options);

    return;
  }

  // TODO: Remove `repeat` option in favour of `schedule`.
  if (options.global.repeat == null) {
    await run(options);

    return;
  }

  if (options.global.repeat === true) {
    await repeatRun(run, options, DEFAULT_REPEAT_CRON_EXPRESSION);

    return;
  }

  await repeatRun(run, options, options.global.repeat);
}

async function runCommand(command, inlineCommandOptions) {
  const options = composeOptions(inlineCommandOptions);

  Logger.setEnableColours(options.global.colour);

  if (options.global.enableUpdateNotifications) {
    notifyUpdate(options.global.colour);
  }

  try {
    await runFunction(command, options);
  } catch (error) {
    handleError(error);
  }
}

export { runCommand };
