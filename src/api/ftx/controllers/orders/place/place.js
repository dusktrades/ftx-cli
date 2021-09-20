import { composeOrderRequests } from './composeOrderRequests.js';
import { settleRequests } from '../../settleRequests.js';

async function place(options) {
  const requests = composeOrderRequests(options);

  await settleRequests(requests);
}

export { place };
