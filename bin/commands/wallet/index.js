import { composeSortOptionConfig } from '../../options/helpers/index.js';

// TODO: Refactor sort options so we can parse it before passing to controller.
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
  'u',
]);

const WALLET = {
  NAME: 'wallet',
  DESCRIPTION: 'Display wallet balances.',
  OPTIONS: [{ OPTION: sortOption }],
};

export { WALLET };
