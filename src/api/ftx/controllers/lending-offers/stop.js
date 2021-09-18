import { spotMargin } from '../../endpoints/index.js';
import { get } from './get.js';

async function fetchOffered({ exchange, credentials, filters }) {
  return get({
    exchange,
    credentials,
    filters: { ...filters, offered: true },
  });
}

function composeRequestBody(currency) {
  return {
    coin: currency,
    size: 0,
    rate: 0,
  };
}

function composeRequest(currency, exchange, credentials) {
  const requestBody = composeRequestBody(currency);

  return spotMargin.createLendingOffer({ exchange, credentials, requestBody });
}

function composeRequests({ exchange, credentials, filters }, offered) {
  return filters.currencies == null
    ? offered.map(({ coin }) => composeRequest(coin, exchange, credentials))
    : filters.currencies.map((currency) =>
        composeRequest(currency, exchange, credentials)
      );
}

async function stop(options) {
  const offered = await fetchOffered(options);
  const requests = composeRequests(options, offered);

  await Promise.all(requests);
}

export { stop };
