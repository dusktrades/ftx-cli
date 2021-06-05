import { program } from 'commander';

import { Logger } from '../../common/index.js';
import { CONFIG } from '../../config/index.js';

function setExchange(exchange) {
  // Important step for future config options so we can skip unaffected options.
  if (exchange == null) {
    return;
  }

  CONFIG.USER.set('EXCHANGE', exchange);
}

async function run() {
  /**
   * We need to query options directly because options object could include
   * option preferences overwritten by config store.
   */
  const { exchange } = program.opts();

  setExchange(exchange);
  Logger.info('Stored option preferences');
}

const config = { run };

export { config };
