import { composeSortOption } from '../../options/helpers/index.js';
import { OPTIONS } from '../../options/index.js';
import { run } from './run.js';

const sortingMethods = [
  { parsed: 'name', options: ['name', 'n'] },
  { parsed: 'price', options: ['price', 'p'] },
  { parsed: 'change-1h', options: ['change-1h', 'c1'] },
  { parsed: 'change-24h', options: ['change-24h', 'c24'] },
  { parsed: 'volume', options: ['volume', 'v'] },
];

const SPOT = {
  name: 'spot',
  description: 'Display spot markets.',
  options: [
    { option: OPTIONS.COMMANDS.CURRENCY },
    { option: OPTIONS.COMMANDS.SPOT_TYPE },
    { option: OPTIONS.COMMANDS.QUOTE_CURRENCY },
    { option: OPTIONS.COMMANDS.TOKEN_LEVERAGE },
    { option: composeSortOption(sortingMethods) },
  ],
  run,
};

export { SPOT };
