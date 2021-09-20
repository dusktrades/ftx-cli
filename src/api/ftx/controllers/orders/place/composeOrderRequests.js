import { ApiError, Logger } from '../../../../../common/index.js';
import { account, markets } from '../../../endpoints/index.js';
import { requiresOption } from '../../../structures/orderTypes.js';

import {
  calculateDelayMilliseconds,
  calculateIndividualRelativeSize,
  calculateIntervalMilliseconds,
  calculatePriceStep,
  calculateRelativePrice,
  calculateSteppedPrice,
  calculateTotalRelativeSize,
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
async function composeIndividualSizeCalculator(
  exchange,
  credentials,
  data,
  initialMarketData
) {
  // Relative size.
  if (data.size.type === 'relative') {
    const [totalSize, accountData] = await Promise.all([
      calculateTotalRelativeSize(
        exchange,
        credentials,
        data,
        initialMarketData
      ),
      account.getAccountInformation({
        exchange,
        credentials,
      }),
    ]);

    const individualSize = totalSize.dividedBy(data.splitCount);

    return (currentMarketData, calculatedPrice) =>
      calculateIndividualRelativeSize(
        { ...data, size: individualSize, price: calculatedPrice },
        currentMarketData,
        accountData
      );
  }

  // Quote currency size.
  if (data.sizeCurrency === 'quote') {
    const individualSize = data.size.value.dividedBy(data.splitCount);

    return (currentMarketData, calculatedPrice) =>
      convertExecutionQuoteSizeToBaseSize(
        { ...data, size: individualSize, price: calculatedPrice },
        currentMarketData
      ).toNumber();
  }

  // Base currency size.
  return () => data.size.value.dividedBy(data.splitCount).toNumber();
}

/**
 * User hasn't provided a price but the provided order type requires it; we
 * should assume they have forgotten it instead of falling back to the API
 * default of treating it as a market order.
 */
function handleMissingPrice() {
  throw new ApiError('Orders that will be executed at limit require price');
}

function composeIndividualPriceCalculator(data, orderIndex) {
  // If the order type doesn't require price, we shouldn't send price.
  if (!requiresOption(data.type, 'price')) {
    return () => null;
  }

  if (data.price == null) {
    return handleMissingPrice;
  }

  switch (data.price.type) {
    case 'relative':
      return (marketData) =>
        calculateRelativePrice(data, marketData).toNumber();
    case 'range': {
      const priceStep = calculatePriceStep(data);

      return () =>
        calculateSteppedPrice(
          data.price.value.from,
          priceStep,
          orderIndex
        ).toNumber();
    }
    default:
      return () => data.price.value.toNumber();
  }
}

async function fetchInitialMarketData(exchange, data) {
  return markets.getSingleMarket({
    exchange,
    pathParameters: { market: data.market },
  });
}

async function composeOrderRequestArray(
  exchange,
  credentials,
  data,
  initialMarketData
) {
  const queue = createOrderQueue(data);
  const intervalMilliseconds = calculateIntervalMilliseconds(data);

  const calculateIndividualSize = await composeIndividualSizeCalculator(
    exchange,
    credentials,
    data,
    initialMarketData
  );

  return Array.from({ length: data.splitCount.toNumber() }).map(
    (_, orderIndex) => {
      const delayMilliseconds = calculateDelayMilliseconds(
        intervalMilliseconds,
        orderIndex
      );

      const calculateIndividualPrice = composeIndividualPriceCalculator(
        data,
        orderIndex
      );

      const individualOrderData = {
        ...data,
        calculateIndividualSize,
        calculateIndividualPrice,
        delayMilliseconds,
      };

      return queueIndividualOrderRequest(
        exchange,
        credentials,
        individualOrderData,
        initialMarketData,
        queue
      );
    }
  );
}

async function composeOrderRequests({ exchange, credentials, data }) {
  try {
    const initialMarketData = await fetchInitialMarketData(exchange, data);

    return await composeOrderRequestArray(
      exchange,
      credentials,
      data,
      initialMarketData
    );
  } catch (error) {
    Logger.error(`Invalid order: ${error?.message ?? 'Unhandled error'}`);

    return null;
  }
}

export { composeOrderRequests };
