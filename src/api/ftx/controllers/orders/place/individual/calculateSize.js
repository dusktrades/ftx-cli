import { markets } from '../../../../endpoints/index.js';
import { ORDER_TYPES } from '../../../../structures/orderTypes.js';

function calculateIndividualSize({ size, split }) {
  return size.dividedBy(split);
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

/**
 * Get the price depending on order execution type.
 *
 * - Market: current bid/ask
 * - Limit: provided/derived limit price
 */
async function getPrice(exchange, data, individualPrice) {
  return ORDER_TYPES[data.type].executionType === 'market'
    ? getBestLimitPrice(exchange, data)
    : individualPrice;
}

async function calculateBaseSize(
  exchange,
  data,
  individualSize,
  individualPrice
) {
  if (data.sizeCurrency === 'base') {
    return individualSize;
  }

  const price = await getPrice(exchange, data, individualPrice);

  return individualSize.dividedBy(price);
}

async function calculateSize(exchange, data, individualPrice) {
  const individualSize = calculateIndividualSize(data);

  const baseSize = await calculateBaseSize(
    exchange,
    data,
    individualSize,
    individualPrice
  );

  return baseSize.toNumber();
}

export { calculateSize };
