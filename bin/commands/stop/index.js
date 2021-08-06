import { OPTIONS } from '../../options/index.js';
import { composeCommand } from '../composeCommand.js';

const CONFIG = {
  NAME: 'stop',
  DESCRIPTION: 'withdraw lending offer(s)',
  OPTIONS: [{ OPTION: OPTIONS.COMMANDS.CURRENCY }],
};

const STOP = composeCommand(CONFIG);

export { STOP };
