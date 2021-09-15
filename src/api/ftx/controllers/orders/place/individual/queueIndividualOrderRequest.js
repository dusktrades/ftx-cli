import { Logger } from '../../../../../../common/index.js';
import { sleep } from '../../../../../../util/index.js';
import { composeIndividualOrderRequest } from './composeIndividualOrderRequest.js';

async function queueIndividualOrderRequest(
  exchange,
  credentials,
  individualOrderData,
  initialMarketData,
  queue
) {
  await sleep(individualOrderData.delayMilliseconds);

  try {
    const request = await composeIndividualOrderRequest(
      exchange,
      credentials,
      individualOrderData,
      initialMarketData
    );

    return queue.add(request);
  } catch (error) {
    Logger.error(
      `  Invalid individual order: ${error?.message ?? 'Unhandled error'}`
    );

    throw error;
  }
}

export { queueIndividualOrderRequest };
