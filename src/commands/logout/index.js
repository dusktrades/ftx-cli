import { Logger } from '../../common/index.js';
import { CONFIG } from '../../config/index.js';

function run() {
  CONFIG.USER.delete('key');
  CONFIG.USER.delete('secret');
  CONFIG.USER.delete('subaccount');
  Logger.info('Removed stored API credentials');
}

const logout = { run };

export { logout };
