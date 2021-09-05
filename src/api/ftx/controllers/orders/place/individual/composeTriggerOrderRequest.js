import { ApiError, Logger } from '../../../../../../common/index.js';
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

function normaliseRetryUntilFilled(enableRetry, simpleType) {
  // Retry-Until-Filled mode only affects market orders.
  if (simpleType === 'market') {
    return enableRetry;
  }

  return null;
}

function normaliseTriggerPrice(triggerPrice, normalisedType) {
  // Trigger price is only required for stop and take profit orders.
  if (!['stop', 'takeProfit'].includes(normalisedType)) {
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

function normaliseTrailValue(trailValue, normalisedType) {
  // Trail value is only required for trailing stop orders.
  if (normalisedType !== 'trailingStop') {
    return null;
  }

  if (trailValue == null) {
    const errorMessage = 'Trailing stop orders must specify trail value';

    Logger.error(`  Failed order: ${errorMessage}`);

    throw new ApiError(errorMessage);
  }

  return trailValue.toNumber();
}

async function composeRequestBody(data) {
  const typeObject = TYPES[data.type];

  const retryUntilFilled = normaliseRetryUntilFilled(
    data.enableRetry,
    typeObject.simpleType
  );

  const orderPrice = await data.calculatePrice();

  const triggerPrice = normaliseTriggerPrice(
    data.triggerPrice,
    typeObject.normalised
  );

  const trailValue = normaliseTrailValue(
    data.trailValue,
    typeObject.normalised
  );

  return {
    market: data.market,
    side: data.side,
    type: typeObject.normalised,
    size: await data.calculateSize(),
    reduceOnly: data.enableReduceOnly,
    ...(retryUntilFilled != null && { retryUntilFilled }),
    ...(orderPrice != null && { orderPrice }),
    ...(triggerPrice != null && { triggerPrice }),
    ...(trailValue != null && { trailValue }),
  };
}

async function composeTriggerOrderRequest(exchange, credentials, data) {
  const requestBody = await composeRequestBody(data);

  return () => orders.placeTriggerOrder({ exchange, credentials, requestBody });
}

export { composeTriggerOrderRequest };
