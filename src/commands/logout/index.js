import { Logger } from '../../common/index.js';
import { CONFIG } from '../../config/index.js';

function run(options) {
  CONFIG.USER.delete('API_KEY');
  CONFIG.USER.delete('API_SECRET');
  CONFIG.USER.delete('SUBACCOUNT');

  Logger.info('Removed stored API credentials', {
    enableColours: options.global.enableColours,
  });
}

const logout = { run };

export { logout };
