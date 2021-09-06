import { ApiError, Logger } from '../../../../../../common/index.js';
import { orders } from '../../../../endpoints/index.js';

import {
  ORDER_TYPES,
  requiresOption,
} from '../../../../structures/orderTypes.js';

function normaliseTriggerPrice(triggerPrice, type) {
  // Trigger price is only required for stop and take profit orders.
  if (!requiresOption(type, 'triggerPrice')) {
    return null;
  }

  if (triggerPrice == null) {
    const errorMessage =
      'Stop and take profit orders must specify trigger price';

    Logger.error(`  Failed order: ${errorMessage}`);

    throw new ApiError(errorMessage);
  }

  return triggerPrice.toNumber();
}

function normaliseTrailValue(trailValue, type) {
  // Trail value is only required for trailing stop orders.
  if (!requiresOption(type, 'trailValue')) {
    return null;
  }

  if (trailValue == null) {
    const errorMessage = 'Trailing stop orders must specify trail value';

    Logger.error(`  Failed order: ${errorMessage}`);

    throw new ApiError(errorMessage);
  }

  return trailValue.toNumber();
}

function normaliseRetryUntilFilled(enableRetry, type) {
  // Retry-Until-Filled mode only affects market orders.
  return ORDER_TYPES[type].executionType === 'market' ? enableRetry : null;
}

async function composeRequestBody(data) {
  const orderPrice = await data.calculatePrice();
  const triggerPrice = normaliseTriggerPrice(data.triggerPrice, data.type);
  const trailValue = normaliseTrailValue(data.trailValue, data.type);

  const retryUntilFilled = normaliseRetryUntilFilled(
    data.enableRetry,
    data.type
  );

  return {
    market: data.market,
    side: data.side,
    type: ORDER_TYPES[data.type].apiArgument,
    size: await data.calculateSize(orderPrice),
    reduceOnly: data.enableReduceOnly,

    ...(orderPrice != null && { orderPrice }),
    ...(triggerPrice != null && { triggerPrice }),
    ...(trailValue != null && { trailValue }),
    ...(retryUntilFilled != null && { retryUntilFilled }),
  };
}

async function composeTriggerOrderRequest(exchange, credentials, data) {
  const requestBody = await composeRequestBody(data);

  return () => orders.placeTriggerOrder({ exchange, credentials, requestBody });
}

export { composeTriggerOrderRequest };
