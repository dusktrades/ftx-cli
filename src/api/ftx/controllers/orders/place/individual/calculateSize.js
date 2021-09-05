import { markets } from '../../../../endpoints/index.js';

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

async function calculateSize(exchange, data) {
  const individualSize = calculateIndividualSize(data);
  const baseSize = await calculateBaseSize(exchange, data, individualSize);

  return baseSize.toNumber();
}

export { calculateSize };
