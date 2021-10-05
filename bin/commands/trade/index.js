import { OPTIONS } from '../../options/index.js';
import { composePrompts } from './composePrompts.js';
import { run } from './run.js';

const TRADE = {
  name: 'trade',
  description: 'Place order(s).',
  options: [
    { option: OPTIONS.COMMANDS.MARKET, isRequired: true },
    { option: OPTIONS.COMMANDS.SIDE, isRequired: true },
    { option: OPTIONS.COMMANDS.ORDER_TYPE, isRequired: true },
    { option: OPTIONS.COMMANDS.SIZE, isRequired: true },
    { option: OPTIONS.COMMANDS.PRICE },
    { option: OPTIONS.COMMANDS.TRIGGER_PRICE },
    { option: OPTIONS.COMMANDS.TRAIL_VALUE },
    { option: OPTIONS.COMMANDS.SPLIT },
    { option: OPTIONS.COMMANDS.DURATION },
  ],
  composePrompts,
  run,
};

export { TRADE };
