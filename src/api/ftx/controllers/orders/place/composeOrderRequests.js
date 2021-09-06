import { calculateIntervalMilliseconds } from './calculateIntervalMilliseconds.js';
import { calculatePriceStep } from './calculatePriceStep.js';
import { createOrderQueue } from './createOrderQueue.js';

import {
  calculateDelayMilliseconds,
  calculatePrice,
  calculateSize,
  queueIndividualOrderRequest,
} from './individual/index.js';

function composeOrderRequests({ exchange, credentials, data }) {
  const queue = createOrderQueue(data.rateLimit);
  const priceStep = calculatePriceStep(data);
  const intervalMilliseconds = calculateIntervalMilliseconds(data);

  return Array.from({ length: data.splitCount.toNumber() }).map((_, index) => {
    const delayMilliseconds = calculateDelayMilliseconds(
      intervalMilliseconds,
      index
    );

    const individualData = {
      ...data,
      calculateSize: (price) => calculateSize(exchange, data, price),
      calculatePrice: () => calculatePrice(data, priceStep, index),
    };

    return queueIndividualOrderRequest(
      exchange,
      credentials,
      individualData,
      queue,
      delayMilliseconds
    );
  });
}

export { composeOrderRequests };
