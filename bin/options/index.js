import { COMMANDS } from './commands/index.js';
import { GLOBAL } from './global/index.js';

/**
 * Option parsers are static; only values provided as part of user input are
 * parsed, meaning defaults for optional values are not handled here.
 */
const OPTIONS = {
  COMMANDS,
  GLOBAL,
};

export { OPTIONS };
