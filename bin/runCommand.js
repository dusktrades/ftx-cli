import { program } from 'commander';
import cron from 'node-cron';

import { Commands } from '../src/commands/index.js';
import { CONFIG } from '../src/config/index.js';
import { handleError } from './handleError.js';

// Repeat at XX:XX:00; used if no user/command-provided schedule.
const FALLBACK_REPEAT_CRON_EXPRESSION = '* * * * *';

function getGlobalOptions() {
  const inlineGlobalOptions = program.opts();

  // Give inlined options priority over stored versions.
  return {
    exchange: inlineGlobalOptions.exchange ?? CONFIG.USER.get('EXCHANGE'),
    key: inlineGlobalOptions.key ?? CONFIG.USER.get('API_KEY'),
    secret: inlineGlobalOptions.secret ?? CONFIG.USER.get('API_SECRET'),
    subaccount: inlineGlobalOptions.subaccount ?? CONFIG.USER.get('SUBACCOUNT'),
    repeat: inlineGlobalOptions.repeat,
    enableColours:
      inlineGlobalOptions.colour ?? CONFIG.USER.get('ENABLE_COLOURS'),
    enableIoc: inlineGlobalOptions.ioc ?? CONFIG.USER.get('ENABLE_IOC'),
    enablePostOnly:
      inlineGlobalOptions.postOnly ?? CONFIG.USER.get('ENABLE_POST_ONLY'),
    enableReduceOnly:
      inlineGlobalOptions.reduceOnly ?? CONFIG.USER.get('ENABLE_REDUCE_ONLY'),
    enableRetry: inlineGlobalOptions.retry ?? CONFIG.USER.get('ENABLE_RETRY'),
    orderRateLimitIntervalMs:
      inlineGlobalOptions.orderInterval ??
      CONFIG.USER.get('ORDER_RATE_LIMIT_INTERVAL_MS'),
    orderRateLimitIntervalQuota:
      inlineGlobalOptions.orderQuota ??
      CONFIG.USER.get('ORDER_RATE_LIMIT_INTERVAL_QUOTA'),
  };
}

function getOptions(inlineCommandOptions) {
  return {
    global: getGlobalOptions(),
    command: inlineCommandOptions,
  };
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

  await runFunction(command, options).catch((error) => {
    handleError(error, options.global.enableColours);
  });
}

export { runCommand };
