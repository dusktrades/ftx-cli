import { ApiError } from '../../../../../../common/index.js';
import { orders } from '../../../../endpoints/index.js';

function normaliseIoc({ type, enableIoc }) {
  // IOC mode only affects basic limit orders.
  return type === 'limit' ? enableIoc : null;
}

function normalisePostOnly({ type, enablePostOnly }) {
  // Post-Only mode only affects basic limit orders.
  return type === 'limit' ? enablePostOnly : null;
}

function composeRequestBody(data) {
  const ioc = normaliseIoc(data);
  const postOnly = normalisePostOnly(data);

  /**
   * Case not handled properly by API: unclear why an error isn't returned,
   * since execution should be impossible.
   */
  if (ioc && postOnly) {
    throw new ApiError('Orders cannot be IOC and Post-Only');
  }

  return {
    market: data.market,
    side: data.side,
    type: data.type,
    size: data.size,
    price: data.price,
    reduceOnly: data.enableReduceOnly,

    ...(ioc != null && { ioc }),
    ...(postOnly != null && { postOnly }),
  };
}

function composeBasicOrderRequest(exchange, credentials, data) {
  const requestBody = composeRequestBody(data);

  return () => orders.placeOrder({ exchange, credentials, requestBody });
}

export { composeBasicOrderRequest };
