import { spotMargin } from '../../endpoints/index.js';
import { get } from './get.js';

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

function composeRequests(exchange, credentials, filters, offeredCurrencies) {
  if (filters.currencies != null) {
    return filters.currencies.map((currency) =>
      composeRequest(currency, exchange, credentials)
    );
  }

  return offeredCurrencies.map((entry) =>
    composeRequest(entry.coin, exchange, credentials)
  );
}

async function stop({ exchange, credentials, filters }) {
  const offeredCurrencies = await get({
    exchange,
    credentials,
    filters: { ...filters, offered: true },
  });

  const requests = composeRequests(
    exchange,
    credentials,
    filters,
    offeredCurrencies
  );

  await Promise.all(requests);
}

export { stop };
