import { ApiError, Logger } from '../../../../../../common/index.js';

const pricedOrderTypes = new Set(['limit', 'stop-limit', 'take-profit-limit']);

function requiresPrice(type) {
  return pricedOrderTypes.has(type);
}

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

function calculateOffset(priceStep, orderIndex) {
  return priceStep.multipliedBy(orderIndex);
}

function calculateSteppedPrice(price, priceStep, orderIndex) {
  const offset = calculateOffset(priceStep, orderIndex);

  return price.value.from.plus(offset);
}

function calculatePrice({ price, type }, priceStep, orderIndex) {
  // If the order type doesn't require price, we shouldn't send price.
  if (!requiresPrice(type)) {
    return null;
  }

  if (price == null) {
    handleMissingPrice();
  }

  return price.type === 'range'
    ? calculateSteppedPrice(price, priceStep, orderIndex)
    : price.value.toNumber();
}

export { calculatePrice };
