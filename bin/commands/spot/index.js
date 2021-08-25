import { composeSortOptionConfig } from '../../options/helpers/index.js';
import { OPTIONS } from '../../options/index.js';

const SORT_OPTION = composeSortOptionConfig([
  'name',
  'price',
  'change-1h',
  'change-24h',
  'volume',
]);

const SPOT = {
  NAME: 'spot',
  DESCRIPTION: 'Display spot markets.',
  OPTIONS: [
    { OPTION: OPTIONS.COMMANDS.CURRENCY },
    { OPTION: OPTIONS.COMMANDS.SPOT_TYPE },
    { OPTION: OPTIONS.COMMANDS.QUOTE_CURRENCY },
    { OPTION: OPTIONS.COMMANDS.TOKEN_LEVERAGE },
    { OPTION: SORT_OPTION },
  ],
};

export { SPOT };
