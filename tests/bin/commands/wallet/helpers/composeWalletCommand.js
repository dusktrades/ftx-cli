import { composeCommand } from '../../../helpers/composeCommand.js';

function composeWalletCommand(options) {
  return composeCommand('wallet', options);
}

export { composeWalletCommand };
