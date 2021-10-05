import { composeSortOption } from '../../options/helpers/index.js';
import { OPTIONS } from '../../options/index.js';
import { run } from './run.js';

const sortingMethods = [
  { parsed: 'market', options: ['market', 'm'] },
  { parsed: 'side', options: ['side', 'S'] },
  { parsed: 'size', options: ['size', 's'] },
  { parsed: 'notional-size', options: ['notional-size', 'ns'] },
  { parsed: 'mark-price', options: ['mark-price', 'mp'] },
  { parsed: 'average-open-price', options: ['average-open-price', 'op'] },
  { parsed: 'break-even-price', options: ['break-even-price', 'bep'] },
  {
    parsed: 'estimated-liquidation-price',
    options: ['estimated-liquidation-price', 'lp'],
  },
  { parsed: 'pnl', options: ['pnl'] },
];

const POSITIONS = {
  name: 'positions',
  description: 'Display my open futures positions.',

  /**
   * TODO: Change `market` to array similar to `currency` or just add a new
   * option for multiple markets (e.g. for filtering). Currently, it works as a
   * filter by chance because Array/String both have `includes` methods.
   */
  options: [
    { option: OPTIONS.COMMANDS.MARKET },
    { option: composeSortOption(sortingMethods) },
  ],
  run,
};

export { POSITIONS };
