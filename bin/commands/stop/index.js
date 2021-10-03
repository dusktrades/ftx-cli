import { OPTIONS } from '../../options/index.js';
import { run } from './run.js';

const STOP = {
  name: 'stop',
  description: 'Withdraw lending offer(s).',
  options: [{ option: OPTIONS.COMMANDS.CURRENCY }],
  run,
};

export { STOP };
