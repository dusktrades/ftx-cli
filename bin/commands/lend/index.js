import { OPTIONS } from '../../options/index.js';
import { composeCommand } from '../composeCommand.js';

const CONFIG = {
  NAME: 'lend',
  DESCRIPTION: 'create lending offer(s)',
  OPTIONS: [
    { OPTION: OPTIONS.COMMANDS.CURRENCY },
    { OPTION: OPTIONS.COMMANDS.SIZE },
    { OPTION: OPTIONS.COMMANDS.MIN_RATE },
  ],
};

const LEND = composeCommand(CONFIG);

export { LEND };
