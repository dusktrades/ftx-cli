import { ApiError } from '../../../../../../common/index.js';
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
    throw new ApiError(
      'Stop and take profit orders must specify trigger price'
    );
  }

  return triggerPrice.toNumber();
}

function normaliseTrailValue(trailValue, type) {
  // Trail value is only required for trailing stop orders.
  if (!requiresOption(type, 'trailValue')) {
    return null;
  }

  if (trailValue == null) {
    throw new ApiError('Trailing stop orders must specify trail value');
  }

  return trailValue.toNumber();
}

function normaliseRetryUntilFilled({ type, retry }) {
  // Retry-Until-Filled mode only affects orders that are executed at market.
  return ORDER_TYPES[type].executionType === 'market' ? retry : null;
}

function composeRequestBody(data) {
  const triggerPrice = normaliseTriggerPrice(data.triggerPrice, data.type);
  const trailValue = normaliseTrailValue(data.trailValue, data.type);

  const retryUntilFilled = normaliseRetryUntilFilled(data);

  return {
    market: data.market,
    side: data.side,
    type: ORDER_TYPES[data.type].apiArgument,
    size: data.size,
    reduceOnly: data.reduceOnly,

    ...(data.price != null && { orderPrice: data.price }),
    ...(triggerPrice != null && { triggerPrice }),
    ...(trailValue != null && { trailValue }),
    ...(retryUntilFilled != null && { retryUntilFilled }),
  };
}

function composeTriggerOrderRequest(exchange, credentials, data) {
  const requestBody = composeRequestBody(data);

  return () => orders.placeTriggerOrder({ exchange, credentials, requestBody });
}

export { composeTriggerOrderRequest };
