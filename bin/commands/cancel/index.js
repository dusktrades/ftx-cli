import { OPTIONS } from '../../options/index.js';

const CANCEL = {
  NAME: 'cancel',
  DESCRIPTION: 'cancel order(s)',
  OPTIONS: [
    { OPTION: OPTIONS.COMMANDS.MARKET },
    { OPTION: OPTIONS.COMMANDS.SIDE },
  ],
};

export { CANCEL };
