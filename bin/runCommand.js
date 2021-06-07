import { program } from 'commander';
import cron from 'node-cron';

import { Commands } from '../src/commands/index.js';
import { CONFIG } from '../src/config/index.js';

// Repeat at 5 minutes past every hour.
const DEFAULT_CRON_EXPRESSION = '5 * * * *';

function getGlobalOptions() {
  const inlineGlobalOptions = program.opts();

  // Give inlined options priority over stored versions.
  return {
    ...inlineGlobalOptions,
    exchange: inlineGlobalOptions.exchange ?? CONFIG.USER.get('EXCHANGE'),
    key: inlineGlobalOptions.key ?? CONFIG.USER.get('API_KEY'),
    secret: inlineGlobalOptions.secret ?? CONFIG.USER.get('API_SECRET'),
    subaccount: inlineGlobalOptions.subaccount ?? CONFIG.USER.get('SUBACCOUNT'),
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

// TODO: We should parse the cron input so CLI has the chance to reject.
function getCronExpression(repeat) {
  return repeat === true ? DEFAULT_CRON_EXPRESSION : repeat;
}

async function repeatRun(runWithOptions, repeat) {
  // Schedule repeat runs.
  cron.schedule(getCronExpression(repeat), async () => {
    await runWithOptions();
  });

  // Execute initial run.
  await runWithOptions();
}

async function runCommand(command, inlineCommandOptions) {
  const { run } = Commands[command];
  const options = getOptions(inlineCommandOptions);
  const runWithOptions = () => run(options);

  await (options.global.repeat == null
    ? runWithOptions()
    : repeatRun(runWithOptions, options.global.repeat));
}

export { runCommand };
