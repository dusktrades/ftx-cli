import { composeCommand } from '../composeCommand.js';

const CONFIG = {
  NAME: 'earnings',
  DESCRIPTION: 'display my lending earnings',
};

const EARNINGS = composeCommand(CONFIG);

export { EARNINGS };
