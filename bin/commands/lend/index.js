import { OPTIONS } from '../../options/index.js';
import { run } from './run.js';

const LEND = {
  name: 'lend',
  description:
    'Create lending offer(s). Matching existing offer(s) will be overwritten.',
  options: [
    { option: OPTIONS.COMMANDS.CURRENCY },
    { option: OPTIONS.COMMANDS.SIZE },
    { option: OPTIONS.COMMANDS.MIN_RATE },
    { option: OPTIONS.COMMANDS.COMPOUND },
  ],
  run,
};

export { LEND };
