import { OPTIONS } from '../../options/index.js';
import { run } from './run.js';

const CANCEL = {
  name: 'cancel',
  description: 'Cancel order(s).',
  options: [
    { option: OPTIONS.COMMANDS.MARKET },
    { option: OPTIONS.COMMANDS.SIDE },
  ],
  run,
};

export { CANCEL };
