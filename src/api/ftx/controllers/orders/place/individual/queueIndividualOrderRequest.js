import { Logger } from '../../../../../../common/index.js';
import { sleep } from '../../../../../../util/index.js';
import { composeIndividualOrderRequest } from './composeIndividualOrderRequest.js';

async function queueIndividualOrderRequest(exchange, credentials, data, queue) {
  await sleep(data.delayMilliseconds);

  try {
    const request = await composeIndividualOrderRequest(
      exchange,
      credentials,
      data
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
