import { markets } from '../../../../endpoints/index.js';
import { isTrigger } from '../../../../structures/orderTypes.js';
import { composeBasicOrderRequest } from './composeBasicOrderRequest.js';
import { composeTriggerOrderRequest } from './composeTriggerOrderRequest.js';

/**
 * If the order has duration then we need to refetch market data before
 * composing each individual request to stop the data used in calculations from
 * becoming stale.
 */
async function composeCurrentMarketData(
  exchange,
  { market, durationMilliseconds },
  initialMarketData
) {
  return durationMilliseconds == null
    ? initialMarketData
    : markets.getSingleMarket({
        exchange,
        pathParameters: { market },
      });
}

async function composeIndividualOrderRequest(
  exchange,
  credentials,
  data,
  initialMarketData
) {
  const currentMarketData = await composeCurrentMarketData(
    exchange,
    data,
    initialMarketData
  );

  const price = await data.calculateIndividualPrice(currentMarketData);
  const size = await data.calculateIndividualSize(currentMarketData, price);
  const staticData = { ...data, price, size };

  return isTrigger(data.type)
    ? composeTriggerOrderRequest(exchange, credentials, staticData)
    : composeBasicOrderRequest(exchange, credentials, staticData);
}

export { composeIndividualOrderRequest };
