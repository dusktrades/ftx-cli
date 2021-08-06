import { composeCommand } from '../composeCommand.js';

const CONFIG = {
  NAME: 'logout',
  DESCRIPTION: 'remove stored FTX API credentials',
};

const LOGOUT = composeCommand(CONFIG);

export { LOGOUT };
