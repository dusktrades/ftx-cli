import { composeSortOption } from '../../options/helpers/index.js';
import { OPTIONS } from '../../options/index.js';
import { composeCommand } from '../composeCommand.js';

const SORT_OPTION = composeSortOption([
  'name',
  'price',
  'change-1h',
  'change-24h',
  'volume',
]);

const CONFIG = {
  NAME: 'spot',
  DESCRIPTION: 'display spot markets',
  OPTIONS: [
    { OPTION: OPTIONS.COMMANDS.CURRENCY },
    { OPTION: OPTIONS.COMMANDS.SPOT_TYPE },
    { OPTION: OPTIONS.COMMANDS.QUOTE_CURRENCY },
    { OPTION: OPTIONS.COMMANDS.TOKEN_LEVERAGE },
    { OPTION: SORT_OPTION },
  ],
};

const SPOT = composeCommand(CONFIG);

export { SPOT };
