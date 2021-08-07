import { composeSortOptionConfig } from '../../options/helpers/index.js';
import { OPTIONS } from '../../options/index.js';

const RATES = {
  NAME: 'rates',
  DESCRIPTION: 'display lending rates',
  OPTIONS: [
    { OPTION: OPTIONS.COMMANDS.CURRENCY },
    { OPTION: composeSortOptionConfig(['currency', 'previous', 'estimated']) },
  ],
};

export { RATES };
