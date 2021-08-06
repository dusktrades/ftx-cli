import { composeCommand } from '../composeCommand.js';

const CONFIG = {
  NAME: 'login',
  DESCRIPTION: 'store FTX API credentials locally',
};

const LOGIN = composeCommand(CONFIG);

export { LOGIN };
