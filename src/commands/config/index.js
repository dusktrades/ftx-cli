import { program } from 'commander';

import { Logger } from '../../common/index.js';
import { CONFIG } from '../../config/index.js';

const commandOptions = [
  'exchange',
  'colour',
  'updateNotifications',
  'reduceOnly',
  'ioc',
  'postOnly',
  'retry',
  'rateLimit',
];

function getModifiedOptions(inlineGlobalOptions) {
  return commandOptions.filter((option) => inlineGlobalOptions[option] != null);
}

function setOptions() {
  const inlineGlobalOptions = program.opts();
  const modifiedOptions = getModifiedOptions(inlineGlobalOptions);

  for (const option of modifiedOptions) {
    const newValue = inlineGlobalOptions[option];

    CONFIG.USER.set(option, newValue);
  }
}

async function run() {
  setOptions();
  Logger.info('Saved configuration');
}

const config = { run };

export { config };
