import { Logger } from '../../common/index.js';
import { CONFIG } from '../../config/index.js';

function logout() {
  CONFIG.USER.delete('API_KEY');
  CONFIG.USER.delete('API_SECRET');
  CONFIG.USER.delete('SUBACCOUNT');

  Logger.info('Removed stored API credentials');
}

export { logout };
