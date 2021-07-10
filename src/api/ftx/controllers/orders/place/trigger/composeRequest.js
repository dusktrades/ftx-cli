import { ApiError } from '../../../../../../common/errors/index.js';
import { orders } from '../../../../endpoints/index.js';

const TYPES = {
  'stop-market': {
    normalised: 'stop',
    requiresPrice: false,
  },
  'stop-limit': {
    normalised: 'stop',
    requiresPrice: true,
  },
  'take-profit-market': {
    normalised: 'takeProfit',
    requiresPrice: false,
  },
  'take-profit-limit': {
    normalised: 'takeProfit',
    requiresPrice: true,
  },
  'trailing-stop': {
    normalised: 'trailingStop',
    requiresPrice: false,
  },
};

function normalisePrice(price, requiresPrice) {
  // Exchange decides price for market orders.
  if (!requiresPrice) {
    return null;
  }

  /**
   * User hasn't provided a price but the provided order type requires it; we
   * should assume they have forgotten it instead of falling back to the API
   * default of treating it as a market order.
   */
  if (price == null) {
    throw new ApiError('Limit orders must specify price');
  }

  return price.toNumber();
}

function composeRequestBody(data) {
  const typeObject = TYPES[data.type];

  return {
    market: data.market,
    side: data.side,
    type: typeObject.normalised,
    triggerPrice: data.triggerPrice,
    orderPrice: normalisePrice(data.price, typeObject.requiresPrice),
    trailValue: data.trailValue,
    size: data.size,
    reduceOnly: data.enableReduceOnly,
    retryUntilFilled: data.enableRetry,
  };
}

function composeRequest(exchange, credentials, data) {
  const requestBody = composeRequestBody(data);

  return orders.placeTriggerOrder({ exchange, credentials, requestBody });
}

export { composeRequest };
