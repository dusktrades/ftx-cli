import BigNumber from 'bignumber.js';

import { ApiError } from '../../../../../../../common/index.js';
import { wallet } from '../../../../../endpoints/index.js';

function getCurrencyBySide(side, { baseCurrency, quoteCurrency }) {
  return side === 'sell' ? baseCurrency : quoteCurrency;
}

function hasBalance(entry) {
  return Boolean(entry?.availableWithoutBorrow > 0);
}

async function fetchBalance(exchange, credentials, data, initialMarketData) {
  const currency = getCurrencyBySide(data.side, initialMarketData);
  const balances = await wallet.getBalances({ exchange, credentials });
  const entry = balances.find(({ coin }) => coin === currency);

  if (!hasBalance(entry)) {
    throw new ApiError(`No ${currency} balance found`);
  }

  return BigNumber(entry.availableWithoutBorrow);
}

async function fetchTotalSpotRelativeSize(
  exchange,
  credentials,
  data,
  initialMarketData
) {
  if (data.sizeHook !== 'default') {
    throw new ApiError('Orders cannot be sized by position in spot markets');
  }

  const hook = await fetchBalance(
    exchange,
    credentials,
    data,
    initialMarketData
  );

  return data.size.value(hook);
}

export { fetchTotalSpotRelativeSize };
