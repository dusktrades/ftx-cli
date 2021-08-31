import { composeSortOptionConfig } from '../../options/helpers/index.js';

const sortOption = composeSortOptionConfig([
  'currency',
  'c',

  'available-with-borrowing',
  'awb',

  'available-without-borrowing',
  'awob',

  'borrowed',
  'b',

  'total',
  't',

  'total-usd',
  'usd',
  'allocation',
  'a',
]);

const WALLET = {
  NAME: 'wallet',
  DESCRIPTION: 'Display wallet balances.',
  OPTIONS: [{ OPTION: sortOption }],
};

export { WALLET };
