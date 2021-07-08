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
    enablePostOnly:
      inlineGlobalOptions.postOnly ?? CONFIG.USER.get('ENABLE_POST_ONLY'),
    enableIoc: inlineGlobalOptions.ioc ?? CONFIG.USER.get('ENABLE_IOC'),
    enableReduceOnly:
      inlineGlobalOptions.reduceOnly ?? CONFIG.USER.get('ENABLE_REDUCE_ONLY'),
  };
}

function getOptions(inlineCommandOptions) {
  return {
    global: getGlobalOptions(),
    command: inlineCommandOptions,
  };
}

async function repeatRun(runWithOptions, cronExpression) {
  // Schedule repeat runs.
  cron.schedule(cronExpression, async () => {
    await runWithOptions();
  });

  // Execute initial run.
  await runWithOptions();
}

async function runCommand(command, inlineCommandOptions) {
  const {
    run,
    DEFAULT_REPEAT_CRON_EXPRESSION = FALLBACK_REPEAT_CRON_EXPRESSION,
  } = Commands[command];

  const options = getOptions(inlineCommandOptions);
  const runWithOptions = () => run(options);

  try {
    if (options.global.repeat == null) {
      await runWithOptions();

      return;
    }

    if (options.global.repeat === true) {
      await repeatRun(runWithOptions, DEFAULT_REPEAT_CRON_EXPRESSION);

      return;
    }

    await repeatRun(runWithOptions, options.global.repeat);
  } catch (error) {
    handleError(error, options.global.enableColours);
  }
}

export { runCommand };
