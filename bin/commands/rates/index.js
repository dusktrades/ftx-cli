import { composeSortOptionConfig } from '../../options/helpers/index.js';
import { OPTIONS } from '../../options/index.js';

const sortOption = composeSortOptionConfig([
  'currency',
  'c',

  'previous',
  'p',

  'estimated',
  'e',
]);

const RATES = {
  NAME: 'rates',
  DESCRIPTION: 'Display lending rates.',
  OPTIONS: [{ OPTION: OPTIONS.COMMANDS.CURRENCY }, { OPTION: sortOption }],
};

export { RATES };
