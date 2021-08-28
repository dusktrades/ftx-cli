import { composeCommand } from '../../../helpers/composeCommand.js';

function composeTradeCommand(options) {
  return composeCommand('trade', `--key key --secret secret ${options}`);
}

export { composeTradeCommand };
