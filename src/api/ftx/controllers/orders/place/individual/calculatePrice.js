import { ApiError, Logger } from '../../../../../../common/index.js';
import { requiresOption } from '../../../../structures/orderTypes.js';

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
  if (!requiresOption(type, 'price')) {
    return null;
  }

  if (price == null) {
    handleMissingPrice();
  }

  return price.type === 'scaled'
    ? calculateSteppedPrice(price, priceStep, orderIndex).toNumber()
    : price.value.toNumber();
}

export { calculatePrice };
