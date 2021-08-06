import { OPTIONS } from '../../options/index.js';
import { composeCommand } from '../composeCommand.js';

const CONFIG = {
  NAME: 'trade',
  DESCRIPTION: 'place order',
  OPTIONS: [
    { OPTION: OPTIONS.COMMANDS.MARKET, IS_REQUIRED: true },
    { OPTION: OPTIONS.COMMANDS.SIDE, IS_REQUIRED: true },
    { OPTION: OPTIONS.COMMANDS.ORDER_TYPE, IS_REQUIRED: true },
    { OPTION: OPTIONS.COMMANDS.SIZE, IS_REQUIRED: true },
    { OPTION: OPTIONS.COMMANDS.PRICE },
    { OPTION: OPTIONS.COMMANDS.TRIGGER_PRICE },
    { OPTION: OPTIONS.COMMANDS.TRAIL_VALUE },
    { OPTION: OPTIONS.COMMANDS.ORDER_COUNT },
  ],
};

const TRADE = composeCommand(CONFIG);

export { TRADE };
