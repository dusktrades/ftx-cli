import { composeSortOptionConfig } from '../../options/helpers/index.js';
import { OPTIONS } from '../../options/index.js';

const sortOption = composeSortOptionConfig([
  'name',
  'n',

  'last-price',
  'lp',

  'mark-price',
  'mp',

  'change-1h',
  'c1',

  'change-24h',
  'c24',

  'volume',
  'v',

  'open-interest',
  'oi',

  'previous-funding',
  'pf',

  'estimated-funding',
  'ef',
]);

// TODO: Remove deprecated `currency` option.
const FUTURES = {
  NAME: 'futures',
  DESCRIPTION: 'Display futures markets.',
  OPTIONS: [
    { OPTION: OPTIONS.COMMANDS.UNDERLYING },
    { OPTION: OPTIONS.COMMANDS.CURRENCY },
    { OPTION: OPTIONS.COMMANDS.FUTURE_TYPE },
    { OPTION: sortOption },
  ],
};

export { FUTURES };
