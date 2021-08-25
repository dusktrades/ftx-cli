import { program } from 'commander';

import { Logger } from '../../common/index.js';
import { CONFIG } from '../../config/index.js';

function canAuthenticate({ key, secret }) {
  return key != null && secret != null;
}

function setSubaccount(subaccount) {
  // If subaccount isn't provided, assume this means we should use main account.
  if (subaccount == null) {
    CONFIG.USER.delete('subaccount');

    return;
  }

  CONFIG.USER.set('subaccount', subaccount);
}

function setCredentials({ key, secret, subaccount }) {
  CONFIG.USER.set('key', key);
  CONFIG.USER.set('secret', secret);
  setSubaccount(subaccount);
}

async function run() {
  const inlineGlobalOptions = program.opts();

  /**
   * At a minimum, we require API key and secret to be able to authenticate;
   * login has failed if we don't receive these options. We perform the check
   * here because they are global options which we are just treating as command
   * options (i.e. we can't require them inline for every command).
   *
   * TODO: Unify this with the other 'required option' behaviour.
   */
  if (!canAuthenticate(inlineGlobalOptions)) {
    Logger.error('Please provide an API key and secret');

    return;
  }

  setCredentials(inlineGlobalOptions);
  Logger.info('Stored API credentials');
}

const login = { run };

export { login };
