import { composeSortOption } from '../../options/helpers/index.js';
import { run } from './run.js';

const sortingMethods = [
  { parsed: 'currency', options: ['currency', 'c'] },
  {
    parsed: 'available-without-borrowing',
    options: ['available-without-borrowing', 'awob'],
  },
  {
    parsed: 'available-with-borrowing',
    options: ['available-with-borrowing', 'awb'],
  },
  { parsed: 'borrowed', options: ['borrowed', 'b'] },
  { parsed: 'total', options: ['total', 't'] },
  { parsed: 'total-usd', options: ['total-usd', 'u'] },
];

const WALLET = {
  name: 'wallet',
  description: 'Display wallet balances.',
  options: [{ option: composeSortOption(sortingMethods) }],
  run,
};

export { WALLET };
