import { program } from 'commander';

import { Commands } from '../src/commands/index.js';
import { Logger } from '../src/common/index.js';
import { CONFIG } from '../src/config/index.js';
import { handleError } from './handleError.js';
import { OPTIONS } from './options/index.js';
import { notifyUpdate } from './notifyUpdate.js';
import { scheduleCommand } from './scheduleCommand.js';
import { syncServerTime } from './syncServerTime.js';

/**
 * Option value priority order:
 *
 * 1. Inline
 * 2. Saved config
 */
function prioritiseOptionValue(option, inlineGlobalOptions) {
  return inlineGlobalOptions[option] ?? CONFIG.USER.get(option);
}

function composeConfigurableGlobalOptions(inlineGlobalOptions) {
  const configurable = OPTIONS.GLOBAL.filter(
    ({ isConfigurable }) => isConfigurable
  );

  const entries = configurable.map(({ name }) => [
    name,
    prioritiseOptionValue(name, inlineGlobalOptions),
  ]);

  return Object.fromEntries(entries);
}

function composeSchedule(schedule, compound) {
  return compound
    ? // Run at 59 minutes past every hour (UTC/exchange time).
      { type: 'cron', cronExpression: '59 * * * *', timezone: 'UTC' }
    : schedule;
}

function composeGlobalOptions(compound) {
  const inlineGlobalOptions = program.opts();

  return {
    ...composeConfigurableGlobalOptions(inlineGlobalOptions),
    schedule: composeSchedule(inlineGlobalOptions.schedule, compound),
  };
}

function composeOptions(inlineCommandOptions) {
  return {
    global: composeGlobalOptions(inlineCommandOptions.compound),
    command: inlineCommandOptions,
  };
}

async function runHandler(command, options) {
  const { run } = Commands[command];

  await (options.global.schedule == null
    ? run(options)
    : scheduleCommand(run, options));
}

async function runCommand(command, inlineCommandOptions) {
  const options = composeOptions(inlineCommandOptions);

  Logger.setEnableColours(options.global.colour);

  if (options.global.updateNotifications) {
    notifyUpdate(options.global.colour);
  }

  try {
    if (options.global.syncTimeIntervalMilliseconds != null) {
      await syncServerTime(options.global);
    }

    await runHandler(command, options);
  } catch (error) {
    handleError(error);
  }
}

export { runCommand };
