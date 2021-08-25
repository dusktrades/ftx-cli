import BigNumber from 'bignumber.js';

import { spotMargin } from '../../endpoints/index.js';
import { get } from './get.js';

function normaliseSize({ size, lendableSize }) {
  /**
   * Priority:
   *
   * 1. Explicit size
   * 2. Per-currency lendable size (safe)
   * 3. 0 (TODO: Error out instead?)
   */
  return size ?? lendableSize ?? 0;
}

function composeRequestBody(currency, data) {
  return {
    coin: currency,
    size: normaliseSize(data),
    rate: data.minRate ?? 0,
  };
}

function roundLendableSize(lendableSize) {
  return lendableSize.decimalPlaces(6, BigNumber.ROUND_DOWN);
}

function offsetLendableSize(roundedLendableSize, lendableSize) {
  if (roundedLendableSize.isEqualTo(lendableSize)) {
    return roundedLendableSize.minus(0.000_001);
  }

  return roundedLendableSize;
}

/**
 * Lendable size is problematic and untrustworthy:
 *
 * - Unpredictable slightly inconsistent values sometimes returned
 * - 'Size too large' errors despite size being under lendable size.
 * - FTX UI encourages up to 6 decimal places
 *
 * We 'fix' this (i.e. greatly reduce number of unexpected errors) by rounding
 * lendable size down to 6 decimal places and, if still equal to the returned
 * lendable size, subtracting 0.000001. This gives us our 'actual' (i.e. safe)
 * lendable size.
 */
function fixLendableSize(lendableSize) {
  const parsedLendableSize = new BigNumber(lendableSize);
  const roundedLendableSize = roundLendableSize(parsedLendableSize);

  const fixedLendableSize = offsetLendableSize(
    roundedLendableSize,
    parsedLendableSize
  );

  return fixedLendableSize.toNumber();
}

function getLendableSize(currency, lendableCurrencies) {
  const lendableEntry = lendableCurrencies.find(
    (entry) => entry.coin === currency
  );

  if (lendableEntry?.lendable == null) {
    return null;
  }

  return fixLendableSize(lendableEntry.lendable);
}

function composeRequest(
  currency,
  exchange,
  credentials,
  data,
  lendableCurrencies
) {
  const lendableSize = getLendableSize(currency, lendableCurrencies);
  const requestBody = composeRequestBody(currency, { ...data, lendableSize });

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
