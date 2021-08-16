import { ApiError, Logger } from '../../../../../../common/index.js';
import { orders } from '../../../../endpoints/index.js';

function normalisePrice({ type, price }, enableColours) {
  // Exchange decides price for market orders.
  if (type === 'market') {
    return null;
  }

  /**
   * User hasn't provided a price but the provided order type requires it; we
   * should assume they have forgotten it instead of falling back to the API
   * default of treating it as a market order.
   */
  if (price == null) {
    const errorMessage = 'Limit orders must specify price';

    Logger.error(`  Failed order: ${errorMessage}`, {
      enableColours,
    });

    throw new ApiError(errorMessage);
  }

  return price.toNumber();
}

function normaliseSize({ size, splitCount }) {
  return size.dividedBy(splitCount).toNumber();
}

function normaliseIoc({ type, enableIoc }) {
  // IOC mode only affects regular limit orders.
  if (type === 'limit') {
    return enableIoc;
  }

  return null;
}

function normalisePostOnly({ type, enablePostOnly }) {
  // Post-Only mode only affects regular limit orders.
  if (type === 'limit') {
    return enablePostOnly;
  }

  return null;
}

function composeRequestBody(data, enableColours) {
  /**
   * Case not handled properly by API: unclear why an error isn't returned,
   * since execution should be impossible.
   */
  if (data.enableIoc && data.enablePostOnly) {
    const errorMessage = 'Orders cannot be IOC and Post-Only';

    Logger.error(`  Failed order: ${errorMessage}`, {
      enableColours,
    });

    throw new ApiError(errorMessage);
  }

  const ioc = normaliseIoc(data);
  const postOnly = normalisePostOnly(data);

  return {
    market: data.market,
    side: data.side,
    type: data.type,
    size: normaliseSize(data),
    price: normalisePrice(data, enableColours),
    reduceOnly: data.enableReduceOnly,
    ...(ioc != null && { ioc }),
    ...(postOnly != null && { postOnly }),
  };
}

function composeRegularRequest(exchange, credentials, data, enableColours) {
  const requestBody = composeRequestBody(data, enableColours);

  return () => orders.placeOrder({ exchange, credentials, requestBody });
}

export { composeRegularRequest };
