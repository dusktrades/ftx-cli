import { composeSortOptionConfig } from '../../options/helpers/index.js';
import { OPTIONS } from '../../options/index.js';

const SORT_OPTION = composeSortOptionConfig([
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

const FUTURES = {
  NAME: 'futures',
  DESCRIPTION: 'display futures markets',
  OPTIONS: [
    { OPTION: OPTIONS.COMMANDS.CURRENCY },
    { OPTION: OPTIONS.COMMANDS.FUTURE_TYPE },
    { OPTION: SORT_OPTION },
  ],
};

export { FUTURES };
