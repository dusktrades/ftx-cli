import { program } from 'commander';
import cron from 'node-cron';

import { Commands } from '../src/commands/index.js';
import { Logger } from '../src/common/index.js';
import { CONFIG } from '../src/config/index.js';
import { sleep } from '../src/util/index.js';
import { handleError } from './handleError.js';
import { notifyUpdate } from './notifyUpdate.js';

function composeSchedule(schedule, compound) {
  // Give `compound` option priority over `schedule` option.
  if (compound) {
    // Run at 59 minutes past every hour.
    return { type: 'cron', cronExpression: '59 * * * *' };
  }

  return schedule;
}

function getGlobalOptions(inlineCommandOptions) {
  const inlineGlobalOptions = program.opts();

  // Give inline options priority over stored config equivalents.
  return {
    exchange: inlineGlobalOptions.exchange ?? CONFIG.USER.get('EXCHANGE'),

    key: inlineGlobalOptions.key ?? CONFIG.USER.get('API_KEY'),
    secret: inlineGlobalOptions.secret ?? CONFIG.USER.get('API_SECRET'),
    subaccount: inlineGlobalOptions.subaccount ?? CONFIG.USER.get('SUBACCOUNT'),

    schedule: composeSchedule(
      inlineGlobalOptions.schedule,
      inlineCommandOptions.compound
    ),

    enableColours:
      inlineGlobalOptions.colour ?? CONFIG.USER.get('ENABLE_COLOURS'),
    enableUpdateNotifications:
      inlineGlobalOptions.updateNotifications ??
      CONFIG.USER.get('ENABLE_UPDATE_NOTIFICATIONS'),

    /**
     * Pseudo-global options: these will only affect the `trade` command, but
     * it's easier to put them here as they're also configurable.
     */
    enableReduceOnly:
      inlineGlobalOptions.reduceOnly ?? CONFIG.USER.get('ENABLE_REDUCE_ONLY'),
    enableIoc: inlineGlobalOptions.ioc ?? CONFIG.USER.get('ENABLE_IOC'),
    enablePostOnly:
      inlineGlobalOptions.postOnly ?? CONFIG.USER.get('ENABLE_POST_ONLY'),
    enableRetry: inlineGlobalOptions.retry ?? CONFIG.USER.get('ENABLE_RETRY'),
    rateLimit: inlineGlobalOptions.rateLimit ?? CONFIG.USER.get('RATE_LIMIT'),
  };
}

function getOptions(inlineCommandOptions) {
  return {
    global: getGlobalOptions(inlineCommandOptions),
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

  // TODO: Add method of ending schedule (e.g. `--schedule-end`).
  cron.schedule(options.global.schedule.cronExpression, async () => {
    await run(options);
    logWaiting(options);
  });

  logWaiting(options);
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
  const options = getOptions(inlineCommandOptions);

  if (options.global.enableUpdateNotifications) {
    notifyUpdate(options.global.enableColours);
  }

  try {
    await runHandler(command, options);
  } catch (error) {
    handleError(error, options.global.enableColours);
  }
}

export { runCommand };
