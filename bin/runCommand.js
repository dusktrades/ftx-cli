import { program } from 'commander';
import cron from 'node-cron';

import { Commands } from '../src/commands/index.js';
import { Logger } from '../src/common/index.js';
import { CONFIG } from '../src/config/index.js';
import { sleep } from '../src/util/index.js';
import { handleError } from './handleError.js';

// Repeat at XX:XX:00; used if no user/command-provided schedule.
const FALLBACK_REPEAT_CRON_EXPRESSION = '* * * * *';

function getGlobalOptions() {
  const inlineGlobalOptions = program.opts();

  // Give inline options priority over stored config equivalents.
  return {
    exchange: inlineGlobalOptions.exchange ?? CONFIG.USER.get('EXCHANGE'),
    key: inlineGlobalOptions.key ?? CONFIG.USER.get('API_KEY'),
    secret: inlineGlobalOptions.secret ?? CONFIG.USER.get('API_SECRET'),
    subaccount: inlineGlobalOptions.subaccount ?? CONFIG.USER.get('SUBACCOUNT'),

    schedule: inlineGlobalOptions.schedule,
    repeat: inlineGlobalOptions.repeat,

    enableIoc: inlineGlobalOptions.ioc ?? CONFIG.USER.get('ENABLE_IOC'),
    enablePostOnly:
      inlineGlobalOptions.postOnly ?? CONFIG.USER.get('ENABLE_POST_ONLY'),
    enableReduceOnly:
      inlineGlobalOptions.reduceOnly ?? CONFIG.USER.get('ENABLE_REDUCE_ONLY'),
    enableRetry: inlineGlobalOptions.retry ?? CONFIG.USER.get('ENABLE_RETRY'),
    rateLimit: inlineGlobalOptions.rateLimit ?? CONFIG.USER.get('RATE_LIMIT'),

    enableColours:
      inlineGlobalOptions.colour ?? CONFIG.USER.get('ENABLE_COLOURS'),
  };
}

function getOptions(inlineCommandOptions) {
  return {
    global: getGlobalOptions(),
    command: inlineCommandOptions,
  };
}

function logWaiting(options) {
  Logger.info('Waiting for schedule trigger', {
    enableColours: options.global.enableColours,
  });
}

async function scheduleCommand(run, options) {
  if (options.global.schedule.type === 'date') {
    logWaiting(options);
    await sleep(options.global.schedule.millisecondsUntilDate);
    await run(options);

    return;
  }

  logWaiting(options);

  // TODO: Add method of ending schedule (e.g. `--schedule-end`).
  cron.schedule(options.global.schedule.cronExpression, () => {
    run(options);
    logWaiting(options);
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
  const options = getOptions(inlineCommandOptions);

  try {
    await runFunction(command, options);
  } catch (error) {
    handleError(error, options.global.enableColours);
  }
}

export { runCommand };
