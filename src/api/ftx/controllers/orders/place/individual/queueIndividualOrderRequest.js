import { sleep } from '../../../../../../util/index.js';
import { composeIndividualOrderRequest } from './composeIndividualOrderRequest.js';

async function queueIndividualOrderRequest(
  exchange,
  credentials,
  data,
  queue,
  delayMilliseconds
) {
  await sleep(delayMilliseconds);

  const request = await composeIndividualOrderRequest(
    exchange,
    credentials,
    data
  );

  return queue.add(request);
}

export { queueIndividualOrderRequest };
