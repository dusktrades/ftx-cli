import { markets } from '../../../../endpoints/index.js';
import { isTrigger } from '../../../../structures/orderTypes.js';
import { composeBasicOrderRequest } from './composeBasicOrderRequest.js';
import { composeTriggerOrderRequest } from './composeTriggerOrderRequest.js';

function isDynamic(value) {
  return value instanceof Function;
}

// Recalculate price if dynamic.
async function recalculatePrice({ price, orderIndex }) {
  return isDynamic(price) ? price(orderIndex) : price;
}

// Recalculate size if dynamic.
async function recalculateSize(size, price) {
  return isDynamic(size) ? size(price) : size;
}

async function composeIndividualOrderRequest(exchange, credentials, data) {
  /**
   * We fetch the market data here, after any delays, so that we can calculate
   * any dynamic order parameters without redundant fetches.
   */
  const marketData = await markets.getSingleMarket({
    exchange,
    pathParameters: { market: data.market },
  });

  const recalculatedPrice = await recalculatePrice(data);

  const recalculatedData = {
    ...data,
    price: recalculatedPrice,
    size: await recalculateSize(data.size, recalculatedPrice),
  };

  return isTrigger(data.type)
    ? composeTriggerOrderRequest(
        exchange,
        credentials,
        recalculatedData,
        marketData
      )
    : composeBasicOrderRequest(
        exchange,
        credentials,
        recalculatedData,
        marketData
      );
}

export { composeIndividualOrderRequest };
