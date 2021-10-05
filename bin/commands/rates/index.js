import { composeSortOption } from '../../options/helpers/index.js';
import { OPTIONS } from '../../options/index.js';
import { run } from './run.js';

const sortingMethods = [
  { parsed: 'currency', options: ['currency', 'c'] },
  { parsed: 'previous', options: ['previous', 'p'] },

  // TODO: Change to `next` to be more semantic.
  { parsed: 'estimated', options: ['estimated', 'e'] },
];

const RATES = {
  name: 'rates',
  description: 'Display lending rates.',
  options: [
    { option: OPTIONS.COMMANDS.CURRENCY },
    { option: composeSortOption(sortingMethods) },
  ],
  run,
};

export { RATES };
