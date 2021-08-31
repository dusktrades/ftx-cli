import { Logger } from '../../common/index.js';
import { CONFIG } from '../../config/index.js';

function removeOptions() {
  CONFIG.USER.delete('key');
  CONFIG.USER.delete('secret');
  CONFIG.USER.set('subaccount', 'main');
}

function run() {
  removeOptions();
  Logger.info('Removed credentials');
}

const logout = { run };

export { logout };
