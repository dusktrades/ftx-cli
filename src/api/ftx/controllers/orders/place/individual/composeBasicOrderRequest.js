import { ApiError, Logger } from '../../../../../../common/index.js';
import { orders } from '../../../../endpoints/index.js';

function normaliseIoc({ type, enableIoc }) {
  // IOC mode only affects basic limit orders.
  return type === 'limit' ? enableIoc : null;
}

function normalisePostOnly({ type, enablePostOnly }) {
  // Post-Only mode only affects basic limit orders.
  return type === 'limit' ? enablePostOnly : null;
}

async function composeRequestBody(data) {
  /**
   * Case not handled properly by API: unclear why an error isn't returned,
   * since execution should be impossible.
   */
  if (data.enableIoc && data.enablePostOnly) {
    const errorMessage = 'Orders cannot be IOC and Post-Only';

    Logger.error(`  Failed order: ${errorMessage}`);

    throw new ApiError(errorMessage);
  }

  const ioc = normaliseIoc(data);
  const postOnly = normalisePostOnly(data);
  const price = await data.calculatePrice();

  return {
    market: data.market,
    side: data.side,
    type: data.type,
    size: await data.calculateSize(price),
    price,
    reduceOnly: data.enableReduceOnly,

    ...(ioc != null && { ioc }),
    ...(postOnly != null && { postOnly }),
  };
}

async function composeBasicOrderRequest(exchange, credentials, data) {
  const requestBody = await composeRequestBody(data);

  return () => orders.placeOrder({ exchange, credentials, requestBody });
}

export { composeBasicOrderRequest };
