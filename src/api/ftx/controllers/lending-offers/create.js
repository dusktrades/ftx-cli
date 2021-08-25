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

function getLendableSize(currency, lendableCurrencies) {
  const lendableEntry = lendableCurrencies.find(
    (entry) => entry.coin === currency
  );

  return lendableEntry?.lendable;
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
