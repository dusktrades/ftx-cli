import { program } from 'commander';

import { Logger } from '../../common/index.js';
import { CONFIG } from '../../config/index.js';

const commandOptions = [
  'exchange',
  'sizeCurrency',
  'priceHook',
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

function saveOptions() {
  const inlineGlobalOptions = program.opts();
  const modifiedOptions = getModifiedOptions(inlineGlobalOptions);

  for (const option of modifiedOptions) {
    const newValue = inlineGlobalOptions[option];

    CONFIG.USER.set(option, newValue);
  }
}

async function run() {
  saveOptions();
  Logger.info('Saved configuration');
}

const config = { run };

export { config };
