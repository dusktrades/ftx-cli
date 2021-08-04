import BigNumber from 'bignumber.js';

import { ApiError } from '../../../../../../common/errors/index.js';
import { orders } from '../../../../endpoints/index.js';

const TYPES = {
  'stop-market': {
    normalised: 'stop',
    simpleType: 'market',
  },
  'stop-limit': {
    normalised: 'stop',
    simpleType: 'limit',
  },
  'trailing-stop': {
    normalised: 'trailingStop',
    simpleType: 'market',
  },
  'take-profit-market': {
    normalised: 'takeProfit',
    simpleType: 'market',
  },
  'take-profit-limit': {
    normalised: 'takeProfit',
    simpleType: 'limit',
  },
};

function normalisePrice(price, simpleType) {
  // Exchange decides price for market orders.
  if (simpleType === 'market') {
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

function normaliseTriggerPrice(triggerPrice, normalisedType) {
  // Trigger price is only required for stop and take profit orders.
  if (!['stop', 'takeProfit'].includes(normalisedType)) {
    return null;
  }

  if (triggerPrice == null) {
    throw new ApiError(
      'Stop and Take Profit orders must specify trigger price'
    );
  }

  return triggerPrice.toNumber();
}

function normaliseTrailValue(trailValue, normalisedType) {
  // Trail value is only required for trailing stop orders.
  if (normalisedType !== 'trailingStop') {
    return null;
  }

  if (trailValue == null) {
    throw new ApiError('Trailing Stop orders must specify trail value');
  }

  return trailValue.toNumber();
}

function normaliseSize(data) {
  // TODO: Parse input to BigNumber instead of in controller.
  return new BigNumber(data.size).dividedBy(data.orderCount).toNumber();
}

function composeRequestBody(data) {
  const typeObject = TYPES[data.type];

  return {
    market: data.market,
    side: data.side,
    type: typeObject.normalised,
    triggerPrice: normaliseTriggerPrice(
      data.triggerPrice,
      typeObject.normalised
    ),
    orderPrice: normalisePrice(data.price, typeObject.simpleType),
    trailValue: normaliseTrailValue(data.trailValue, typeObject.normalised),
    size: normaliseSize(data),
    reduceOnly: data.enableReduceOnly,
    retryUntilFilled: data.enableRetry,
  };
}

function composeTriggerRequest(exchange, credentials, data) {
  const requestBody = composeRequestBody(data);

  return () => orders.placeTriggerOrder({ exchange, credentials, requestBody });
}

export { composeTriggerRequest };
