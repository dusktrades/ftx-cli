import { program } from 'commander';

import { Logger } from '../../../src/common/index.js';
import { CONFIG } from '../../../src/config/index.js';

const commandOptions = ['key', 'secret', 'subaccount'];

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
  Logger.info('Saved credentials');
}

export { run };
