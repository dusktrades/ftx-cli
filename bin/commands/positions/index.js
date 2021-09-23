import { composeSortOptionConfig } from '../../options/helpers/index.js';
import { OPTIONS } from '../../options/index.js';

const sortOption = composeSortOptionConfig([
  'market',
  'm',

  'side',
  'S',

  'size',
  's',

  'notional-size',
  'ns',

  'mark-price',
  'mp',

  'average-open-price',
  'op',

  'break-even-price',
  'bep',

  'estimated-liquidation-price',
  'lp',

  'pnl',
]);

const POSITIONS = {
  NAME: 'positions',
  DESCRIPTION: 'Display my open futures positions.',

  /**
   * TODO: Change `market` to array similar to `currency` or just add a new
   * option for multiple markets (e.g. for filtering). Currently, it works as a
   * filter by chance because Array/String both have `includes` methods.
   */
  OPTIONS: [{ OPTION: OPTIONS.COMMANDS.MARKET }, { OPTION: sortOption }],
};

export { POSITIONS };
