import {
  convertPercentageToDecimal,
  convertYearlyToHourly,
  truncate,
} from '../../../../util/index.js';

import { spotMargin } from '../../endpoints/index.js';
import { get } from './get.js';

/**
 * At the time of writing, the FTX API behaves inconsistently when using decimal
 * precision of more than 8 decimal places.
 */
function correctExplicitSize(size) {
  return truncate(size, 8);
}

/**
 * The FTX API behaves strangely (unpredictable 'Size too large' errors) above 6
 * decimal places near lendable size due to inconsistent lendable size values
 * being returned. Therefore, we 'correct' lendable size, by truncating it to 6
 * decimal places, before using it in subsequent API calls. The FTX UI also
 * encourages inputs of up to 6 decimal places.
 */
function correctLendableSize(lendableSize) {
  return truncate(lendableSize, 6);
}

function processSize(size, lendableSize) {
  // If explicit size is given, use that.
  if (size != null) {
    return correctExplicitSize(size);
  }

  // If the currency has a lendable size value, use that.
  if (lendableSize != null) {
    return correctLendableSize(lendableSize);
  }

  // Nothing to decide size from. As a last resort, default to 0.
  return 0;
}

function processMinRate(minRate) {
  if (minRate == null) {
    return 0;
  }

  const minRateHourly = convertYearlyToHourly(minRate);

  return convertPercentageToDecimal(minRateHourly);
}

function composeRequestBody(currency, data, lendableSize) {
  return {
    coin: currency,
    size: processSize(data.size, lendableSize),
    rate: processMinRate(data.minRate),
  };
}

function getLendableSize(currency, lendableCurrencies) {
  const lendableEntry = lendableCurrencies.find(
    (entry) => entry.coin === currency
  );

  if (lendableEntry == null) {
    return null;
  }

  return lendableEntry.lendable;
}

function composeRequest(
  currency,
  exchange,
  credentials,
  data,
  lendableCurrencies
) {
  const lendableSize = getLendableSize(currency, lendableCurrencies);
  const requestBody = composeRequestBody(currency, data, lendableSize);

  return spotMargin.createLendingOffer({ exchange, credentials, requestBody });
}

function composeRequests(
  exchange,
  credentials,
  data,
  filters,
  lendableCurrencies
) {
  if (filters.currencies != null) {
    return filters.currencies.map((currency) =>
      composeRequest(currency, exchange, credentials, data, lendableCurrencies)
    );
  }

  return lendableCurrencies.map((entry) =>
    composeRequest(entry.coin, exchange, credentials, data, lendableCurrencies)
  );
}

async function create({ exchange, credentials, data, filters }) {
  const lendableCurrencies = await get({
    exchange,
    credentials,
    filters: { ...filters, lendable: true },
  });

  const requests = composeRequests(
    exchange,
    credentials,
    data,
    filters,
    lendableCurrencies
  );

  await Promise.all(requests);
}

export { create };
