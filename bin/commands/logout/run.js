import { Logger } from '../../../src/common/index.js';
import { CONFIG } from '../../../src/config/index.js';

function removeOptions() {
  CONFIG.USER.delete('key');
  CONFIG.USER.delete('secret');
  CONFIG.USER.set('subaccount', 'main');
}

function run() {
  removeOptions();
  Logger.info('Removed credentials');
}

export { run };
