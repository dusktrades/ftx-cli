import { ApiError, Logger } from '../../../../../../common/index.js';
import { markets, orders } from '../../../../endpoints/index.js';

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
    const errorMessage = 'Limit orders must specify price';

    Logger.error(`  Failed order: ${errorMessage}`);

    throw new ApiError(errorMessage);
  }

  return price.toNumber();
}

function calculateIndividualSize({ size, splitCount }) {
  return size.dividedBy(splitCount);
}

/**
 * Get the best available (i.e. closest to spread) limit price depending on
 * order side.
 *
 * - Buy: ask price
 * - Sell: bid price
 */
async function getBestLimitPrice(exchange, { market, side }) {
  const data = await markets.getSingleMarket({
    exchange,
    pathParameters: { market },
  });

  return side === 'sell' ? data.bid : data.ask;
}

async function getPrice(exchange, data) {
  return data.type === 'market'
    ? getBestLimitPrice(exchange, data)
    : data.price;
}

async function calculateBaseSize(exchange, data, individualSize) {
  if (data.sizeCurrency === 'base') {
    return individualSize;
  }

  const price = await getPrice(exchange, data);

  return individualSize.dividedBy(price);
}

async function normaliseSize(exchange, data) {
  const individualSize = calculateIndividualSize(data);
  const baseSize = await calculateBaseSize(exchange, data, individualSize);

  return baseSize.toNumber();
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

async function composeRequestBody(exchange, data) {
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

  return {
    market: data.market,
    side: data.side,
    type: data.type,
    size: await normaliseSize(exchange, data),
    price: normalisePrice(data),
    reduceOnly: data.enableReduceOnly,
    ...(ioc != null && { ioc }),
    ...(postOnly != null && { postOnly }),
  };
}

async function composeRegularRequest(exchange, credentials, data) {
  const requestBody = await composeRequestBody(exchange, data);

  return () => orders.placeOrder({ exchange, credentials, requestBody });
}

export { composeRegularRequest };
