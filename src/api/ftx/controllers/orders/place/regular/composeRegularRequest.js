import { ApiError } from '../../../../../../common/errors/index.js';
import { orders } from '../../../../endpoints/index.js';

function normalisePrice({ type, price }) {
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
    throw new ApiError('Limit orders must specify price');
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

function composeRequestBody(data) {
  /**
   * Case not handled properly by API: unclear why an error isn't returned,
   * since execution should be impossible.
   */
  if (data.enableIoc && data.enablePostOnly) {
    throw new ApiError('Orders cannot be IOC and Post-Only');
  }

  const ioc = normaliseIoc(data);
  const postOnly = normalisePostOnly(data);

  return {
    market: data.market,
    side: data.side,
    type: data.type,
    size: normaliseSize(data),
    price: normalisePrice(data),
    reduceOnly: data.enableReduceOnly,
    ...(ioc != null && { ioc }),
    ...(postOnly != null && { postOnly }),
  };
}

function composeRegularRequest(exchange, credentials, data) {
  const requestBody = composeRequestBody(data);

  return () => orders.placeOrder({ exchange, credentials, requestBody });
}

export { composeRegularRequest };
