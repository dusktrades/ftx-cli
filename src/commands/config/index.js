import { program } from 'commander';

import { Logger } from '../../common/index.js';
import { CONFIG } from '../../config/index.js';

const CONFIG_OPTIONS = [
  { OPTION_KEY: 'exchange', CONFIG_KEY: 'EXCHANGE' },
  { OPTION_KEY: 'colour', CONFIG_KEY: 'ENABLE_COLOURS' },
];

function setOption(key, value) {
  // Skip options unaffected by included options.
  if (value == null) {
    return;
  }

  CONFIG.USER.set(key, value);
}

function getChangedConfigOptions(inlineGlobalOptions) {
  return CONFIG_OPTIONS.filter(
    ({ OPTION_KEY }) => inlineGlobalOptions[OPTION_KEY] != null
  );
}

function setOptions() {
  /**
   * We need to query options directly because options object could include
   * option preferences overwritten by config store.
   */
  const inlineGlobalOptions = program.opts();
  const changedConfigOptions = getChangedConfigOptions(inlineGlobalOptions);

  for (const configOption of changedConfigOptions) {
    const newValue = inlineGlobalOptions[configOption.OPTION_KEY];

    setOption(configOption.CONFIG_KEY, newValue);
  }
}

async function run() {
  setOptions();
  Logger.info('Stored option preferences');
}

const config = { run };

export { config };
