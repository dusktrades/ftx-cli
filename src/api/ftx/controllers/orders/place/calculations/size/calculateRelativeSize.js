import { calculateFuturesRelativeSize } from './calculateFuturesRelativeSize.js';
import { calculateSpotRelativeSize } from './calculateSpotRelativeSize.js';

async function calculateDynamicSize(exchange, credentials, data, marketData) {
  return marketData.type === 'future'
    ? calculateFuturesRelativeSize(
        exchange,
        credentials,
        data,
        marketData.price
      )
    : calculateSpotRelativeSize(exchange, credentials, data, marketData);
}

async function calculateTotalSize(exchange, credentials, data, marketData) {
  return data.sizeHook.type === 'dynamic'
    ? calculateDynamicSize(exchange, credentials, data, marketData)
    : data.size.value(data.sizeHook.value);
}

function calculateIndividualSize(size, splitCount) {
  return size.dividedBy(splitCount);
}

async function calculateRelativeSize(exchange, credentials, data, marketData) {
  const totalSize = await calculateTotalSize(
    exchange,
    credentials,
    data,
    marketData
  );

  return calculateIndividualSize(totalSize, data.splitCount);
}

export { calculateRelativeSize };
