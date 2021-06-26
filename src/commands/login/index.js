import { program } from 'commander';

import { Logger } from '../../common/index.js';
import { CONFIG } from '../../config/index.js';

function canAuthenticate({ key, secret }) {
  return key != null && secret != null;
}

function setSubaccount(subaccount) {
  // If subaccount isn't provided, assume this means we should use main account.
  if (subaccount == null) {
    CONFIG.USER.delete('SUBACCOUNT');

    return;
  }

  CONFIG.USER.set('SUBACCOUNT', subaccount);
}

function setCredentials({ key, secret, subaccount }) {
  CONFIG.USER.set('API_KEY', key);
  CONFIG.USER.set('API_SECRET', secret);
  setSubaccount(subaccount);
}

async function run(options) {
  /**
   * We need to query options directly because options object could include
   * credentials overwritten by config store.
   */
  const inlineGlobalOptions = program.opts();

  /**
   * At the minimum, we require API key and secret to be able to authenticate;
   * login has failed if we don't receive these options.
   */
  if (!canAuthenticate(inlineGlobalOptions)) {
    Logger.error('Please provide an API key and secret', {
      enableColours: options.global.enableColours,
    });

    return;
  }

  setCredentials(inlineGlobalOptions);

  Logger.info('Stored API credentials', {
    enableColours: options.global.enableColours,
  });
}

const login = { run };

export { login };
