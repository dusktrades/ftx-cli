import { OPTIONS } from '../../options/index.js';

const LEND = {
  NAME: 'lend',
  DESCRIPTION: 'create lending offer(s)',
  OPTIONS: [
    { OPTION: OPTIONS.COMMANDS.CURRENCY },
    { OPTION: OPTIONS.COMMANDS.SIZE },
    { OPTION: OPTIONS.COMMANDS.MIN_RATE },
    { OPTION: OPTIONS.COMMANDS.COMPOUND },
  ],
};

export { LEND };
