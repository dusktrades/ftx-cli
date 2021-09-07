import BigNumber from 'bignumber.js';

import { ApiError, Logger } from '../../../../../../common/index.js';
import { markets } from '../../../../endpoints/index.js';
import { requiresOption } from '../../../../structures/orderTypes.js';

const marketDataKeyByHookName = {
  mark: 'price',
  last: 'last',
  bid: 'bid',
  ask: 'ask',
};

/**
 * User hasn't provided a price but the provided order type requires it; we
 * should assume they have forgotten it instead of falling back to the API
 * default of treating it as a market order.
 */
function handleMissingPrice() {
  const errorMessage = 'Limit orders must specify price';

  Logger.error(`  Failed order: ${errorMessage}`);

  throw new ApiError(errorMessage);
}

async function calculateNamedHookRelativePrice(
  exchange,
  { price, priceHook, market }
) {
  const data = await markets.getSingleMarket({
    exchange,
    pathParameters: { market },
  });

  const key = marketDataKeyByHookName[priceHook.value];
  const priceHookPrice = new BigNumber(data[key]);

  return price.value(priceHookPrice);
}

async function calculateRelativePrice(exchange, data) {
  return data.priceHook.type === 'named'
    ? calculateNamedHookRelativePrice(exchange, data)
    : data.price.value(data.priceHook.value);
}

function calculateOffset(priceStep, orderIndex) {
  return priceStep.multipliedBy(orderIndex);
}

function calculateSteppedPrice(price, priceStep, orderIndex) {
  const offset = calculateOffset(priceStep, orderIndex);

  return price.value.from.plus(offset);
}

async function calculatePriceByType(exchange, data, priceStep, orderIndex) {
  switch (data.price.type) {
    case 'relative':
      return calculateRelativePrice(exchange, data);
    case 'range':
      return calculateSteppedPrice(data.price, priceStep, orderIndex);
    default:
      return data.price.value;
  }
}

async function calculatePrice(exchange, data, priceStep, orderIndex) {
  // If the order type doesn't require price, we shouldn't send price.
  if (!requiresOption(data.type, 'price')) {
    return null;
  }

  if (data.price == null) {
    handleMissingPrice();
  }

  const price = await calculatePriceByType(
    exchange,
    data,
    priceStep,
    orderIndex
  );

  return price.toNumber();
}

export { calculatePrice };
