import { composeSortOptionConfig } from '../../options/helpers/index.js';
import { OPTIONS } from '../../options/index.js';

const sortOption = composeSortOptionConfig([
  'name',
  'n',

  'price',
  'p',

  'change-1h',
  'c1',

  'change-24h',
  'c24',

  'volume',
  'v',
]);

const SPOT = {
  NAME: 'spot',
  DESCRIPTION: 'Display spot markets.',
  OPTIONS: [
    { OPTION: OPTIONS.COMMANDS.CURRENCY },
    { OPTION: OPTIONS.COMMANDS.SPOT_TYPE },
    { OPTION: OPTIONS.COMMANDS.QUOTE_CURRENCY },
    { OPTION: OPTIONS.COMMANDS.TOKEN_LEVERAGE },
    { OPTION: sortOption },
  ],
};

export { SPOT };
