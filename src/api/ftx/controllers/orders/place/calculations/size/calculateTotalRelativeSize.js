import { fetchTotalFuturesRelativeSize } from './fetchTotalFuturesRelativeSize.js';
import { fetchTotalSpotRelativeSize } from './fetchTotalSpotRelativeSize.js';

async function calculateTotalRelativeSize(
  exchange,
  credentials,
  data,
  initialMarketData
) {
  return initialMarketData.type === 'future'
    ? fetchTotalFuturesRelativeSize(exchange, credentials, data)
    : fetchTotalSpotRelativeSize(
        exchange,
        credentials,
        data,
        initialMarketData
      );
}

export { calculateTotalRelativeSize };
