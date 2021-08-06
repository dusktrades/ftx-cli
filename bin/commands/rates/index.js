import { composeSortOption } from '../../options/helpers/index.js';
import { OPTIONS } from '../../options/index.js';
import { composeCommand } from '../composeCommand.js';

const CONFIG = {
  NAME: 'rates',
  DESCRIPTION: 'display lending rates',
  OPTIONS: [
    { OPTION: OPTIONS.COMMANDS.CURRENCY },
    { OPTION: composeSortOption(['currency', 'previous', 'estimated']) },
  ],
};

const RATES = composeCommand(CONFIG);

export { RATES };
