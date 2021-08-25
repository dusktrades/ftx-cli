import { program } from 'commander';
import cron from 'node-cron';

import { Commands } from '../src/commands/index.js';
import { Logger } from '../src/common/index.js';
import { CONFIG } from '../src/config/index.js';
import { sleep } from '../src/util/index.js';
import { handleError } from './handleError.js';
import { notifyUpdate } from './notifyUpdate.js';

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

function composeSchedule(schedule, compound) {
  // Give `compound` option priority over `schedule` option.
  if (compound) {
    // Run at 59 minutes past every hour.
    return { type: 'cron', cronExpression: '59 * * * *' };
  }

  return schedule;
}

function composeGlobalOptions() {
  const inlineGlobalOptions = program.opts();
  const globalConfigOptions = composeGlobalConfigOptions(inlineGlobalOptions);

  return {
    ...globalConfigOptions,
    schedule: composeSchedule(inlineGlobalOptions.schedule),
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

  // TODO: Add method of ending schedule (e.g. `--schedule-end`).
  cron.schedule(options.global.schedule.cronExpression, async () => {
    await run(options);
    logWaiting();
  });

  logWaiting();
}

async function runHandler(command, options) {
  const { run } = Commands[command];

  if (options.global.schedule != null) {
    await scheduleCommand(run, options);

    return;
  }

  await run(options);
}

async function runCommand(command, inlineCommandOptions) {
  const options = composeOptions(inlineCommandOptions);

  Logger.setEnableColours(options.global.colour);

  if (options.global.enableUpdateNotifications) {
    notifyUpdate(options.global.colour);
  }

  try {
    await runHandler(command, options);
  } catch (error) {
    handleError(error);
  }
}

export { runCommand };
