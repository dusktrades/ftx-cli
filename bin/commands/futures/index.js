import { composeSortOption } from '../../options/helpers/index.js';
import { OPTIONS } from '../../options/index.js';
import { run } from './run.js';

const sortingMethods = [
  { parsed: 'name', options: ['name', 'n'] },
  { parsed: 'mark-price', options: ['mark-price', 'mp'] },
  { parsed: 'last-price', options: ['last-price', 'lp'] },
  { parsed: 'change-1h', options: ['change-1h', 'c1'] },
  { parsed: 'change-24h', options: ['change-24h', 'c24'] },
  { parsed: 'volume', options: ['volume', 'v'] },
  { parsed: 'open-interest', options: ['open-interest', 'oi'] },
  { parsed: 'previous-funding', options: ['previous-funding', 'pf'] },

  // TODO: Change to `next-funding` to be more semantic.
  { parsed: 'estimated-funding', options: ['estimated-funding', 'ef'] },
];

// TODO: Remove deprecated `currency` option.
const FUTURES = {
  name: 'futures',
  description: 'Display futures markets.',
  options: [
    { option: OPTIONS.COMMANDS.UNDERLYING },
    { option: OPTIONS.COMMANDS.CURRENCY },
    { option: OPTIONS.COMMANDS.FUTURE_TYPE },
    { option: composeSortOption(sortingMethods) },
  ],
  run,
};

export { FUTURES };
