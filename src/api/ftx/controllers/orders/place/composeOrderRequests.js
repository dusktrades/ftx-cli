import { ApiError, Logger } from '../../../../../common/index.js';
import { markets } from '../../../endpoints/index.js';
import { requiresOption } from '../../../structures/orderTypes.js';

import {
  calculateDelayMilliseconds,
  calculateIntervalMilliseconds,
  calculatePriceStep,
  calculateRelativePrice,
  calculateRelativeSize,
  calculateSteppedPrice,
  convertExecutionQuoteSizeToBaseSize,
} from './calculations/index.js';

import { createOrderQueue } from './createOrderQueue.js';
import { queueIndividualOrderRequest } from './individual/queueIndividualOrderRequest.js';

/**
 * When size is provided as a number in base currency terms or as a number
 * relative to a size hook, individual orders will have identical sizes because
 * the quote currency becomes irrelevant. Therefore, regardless of splits or
 * duration, we don't need to recalculate the size on a per-order basis.
 */
async function calculateIndividualSize(
  exchange,
  credentials,
  data,
  marketData
) {
  if (data.size.type === 'relative') {
    return (
      await calculateRelativeSize(exchange, credentials, data, marketData)
    ).toNumber();
  }

  // TODO: TWAP orders: need to refetch market data so it doesn't get stale.
  return data.sizeCurrency === 'quote'
    ? (dynamicPrice) =>
        convertExecutionQuoteSizeToBaseSize(
          { ...data, price: dynamicPrice },
          marketData
        )
          .dividedBy(data.splitCount)
          .toNumber()
    : data.size.value.dividedBy(data.splitCount).toNumber();
}

/**
 * User hasn't provided a price but the provided order type requires it; we
 * should assume they have forgotten it instead of falling back to the API
 * default of treating it as a market order.
 */
function handleMissingPrice() {
  throw new ApiError('Orders that will be executed at limit require price');
}

async function calculatePriceByType(data, marketData) {
  switch (data.price.type) {
    case 'relative':
      return calculateRelativePrice(data, marketData).toNumber();
    case 'range': {
      const priceStep = calculatePriceStep(data);

      return (orderIndex) =>
        calculateSteppedPrice(
          data.price.value.from,
          priceStep,
          orderIndex
        ).toNumber();
    }
    default:
      return data.price.value.toNumber();
  }
}

async function calculateIndividualPrice(data, marketData) {
  // If the order type doesn't require price, we shouldn't send price.
  if (!requiresOption(data.type, 'price')) {
    return null;
  }

  if (data.price == null) {
    handleMissingPrice();
  }

  return calculatePriceByType(data, marketData);
}

async function calculateInitialData(exchange, credentials, data) {
  const marketData = await markets.getSingleMarket({
    exchange,
    pathParameters: { market: data.market },
  });

  const [individualSize, individualPrice] = await Promise.all([
    calculateIndividualSize(exchange, credentials, data, marketData),
    calculateIndividualPrice(data, marketData),
  ]);

  return { individualSize, individualPrice };
}

function composeOrderRequestArray(exchange, credentials, data, initialData) {
  const queue = createOrderQueue(data.rateLimit);
  const intervalMilliseconds = calculateIntervalMilliseconds(data);

  return Array.from({ length: data.splitCount.toNumber() }).map(
    (_, orderIndex) => {
      const delayMilliseconds = calculateDelayMilliseconds(
        intervalMilliseconds,
        orderIndex
      );

      const individualData = {
        ...data,
        size: initialData.individualSize,
        price: initialData.individualPrice,
        delayMilliseconds,
        orderIndex,
      };

      return queueIndividualOrderRequest(
        exchange,
        credentials,
        individualData,
        queue
      );
    }
  );
}

async function composeOrderRequests({ exchange, credentials, data }) {
  try {
    const initialData = await calculateInitialData(exchange, credentials, data);

    return composeOrderRequestArray(exchange, credentials, data, initialData);
  } catch (error) {
    Logger.error(`Invalid order: ${error?.message ?? 'Unhandled error'}`);

    return null;
  }
}

export { composeOrderRequests };
