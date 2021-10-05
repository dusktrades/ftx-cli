import { ApiError } from '../../../../common/index.js';
import { spotMargin } from '../../endpoints/index.js';
import { get } from './get.js';

async function fetchLendable({ exchange, credentials, filters }) {
  return get({
    exchange,
    credentials,
    filters: { ...filters, lendable: true },
  });
}

function isSupportedSize(size) {
  return size == null || size.type === 'basic';
}

function normaliseSize(size, lendableSize) {
  if (!isSupportedSize(size)) {
    throw new ApiError(
      'This command currently only supports basic size format'
    );
  }

  /**
   * Priority:
   *
   * 1. Explicit size
   * 2. Corrected per-currency lendable size
   * 3. 0 (TODO: Error out instead?)
   */
  return size?.value ?? lendableSize ?? 0;
}

function composeRequestBody(currency, { size, minRate }, lendableSize) {
  return {
    coin: currency,
    size: normaliseSize(size, lendableSize),
    rate: minRate ?? 0,
  };
}

function getLendableSize(currency, lendable) {
  const entry = lendable.find(({ coin }) => coin === currency);

  return entry?.lendableCorrected;
}

function composeRequest(currency, exchange, credentials, data, lendable) {
  const lendableSize = getLendableSize(currency, lendable);
  const requestBody = composeRequestBody(currency, data, lendableSize);

  return spotMargin.createLendingOffer({ exchange, credentials, requestBody });
}

function composeRequests({ exchange, credentials, data, filters }, lendable) {
  return filters.currencies == null
    ? lendable.map(({ coin }) =>
        composeRequest(coin, exchange, credentials, data, lendable)
      )
    : filters.currencies.map((currency) =>
        composeRequest(currency, exchange, credentials, data, lendable)
      );
}

async function create(options) {
  const lendable = await fetchLendable(options);
  const requests = composeRequests(options, lendable);

  await Promise.all(requests);
}

export { create };
