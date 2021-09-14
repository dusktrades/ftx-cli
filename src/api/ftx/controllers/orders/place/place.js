import { Logger } from '../../../../../common/index.js';
import { settleRequests } from '../../settleRequests.js';
import { composeOrderRequests } from './composeOrderRequests.js';

async function place(options) {
  Logger.info('Processing order(s)');

  const requests = await composeOrderRequests(options);

  if (requests == null) {
    return;
  }

  try {
    await settleRequests(requests);
    Logger.info('Placed order(s)');
  } catch {
    /**
     * Errors are also handled at per-order level because complex orders may be
     * partially accepted and/or have several different errors to report.
     */
    Logger.error('One or more orders failed to be placed');
  }
}

export { place };
