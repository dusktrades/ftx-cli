import { ApiError } from '../../../../../../common/errors/index.js';
import { orders } from '../../../../endpoints/index.js';

function normalisePrice(data) {
  // Exchange decides price for market orders.
  if (data.type === 'market') {
    return null;
  }

  /**
   * User hasn't provided a price but the provided order type requires it; we
   * should assume they have forgotten it instead of falling back to the API
   * default of treating it as a market order.
   */
  if (data.price == null) {
    throw new ApiError('Limit orders must specify price');
  }

  return data.price.toNumber();
}

function normaliseSize(data) {
  return data.size.dividedBy(data.orderCount).toNumber();
}

function normaliseIoc(data) {
  // IOC mode only affects regular limit orders.
  if (data.type === 'limit') {
    return data.enableIoc;
  }

  return null;
}

function normalisePostOnly(data) {
  // Post-Only mode only affects regular limit orders.
  if (data.type === 'limit') {
    return data.enablePostOnly;
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
