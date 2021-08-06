import { composeSortOption } from '../../options/helpers/index.js';
import { OPTIONS } from '../../options/index.js';
import { composeCommand } from '../composeCommand.js';

const SORT_OPTION = composeSortOption([
  'name',
  'last-price',
  'mark-price',
  'change-1h',
  'change-24h',
  'volume',
  'open-interest',
  'oi',
  'previous-funding',
  'estimated-funding',
]);

const CONFIG = {
  NAME: 'futures',
  DESCRIPTION: 'display futures markets',
  OPTIONS: [
    { OPTION: OPTIONS.COMMANDS.CURRENCY },
    { OPTION: OPTIONS.COMMANDS.FUTURE_TYPE },
    { OPTION: SORT_OPTION },
  ],
};

const FUTURES = composeCommand(CONFIG);

export { FUTURES };
