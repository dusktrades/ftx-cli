import BigNumber from 'bignumber.js';

import { ApiError } from '../../../../../../../common/index.js';
import { wallet } from '../../../../../endpoints/index.js';
import { calculateSizeMinusFee } from './calculateSizeMinusFee.js';
import { convertExecutionQuoteSizeToBaseSize } from './convertExecutionQuoteSizeToBaseSize.js';

function getCurrencyBySide(side, { baseCurrency, quoteCurrency }) {
  return side === 'sell' ? baseCurrency : quoteCurrency;
}

function hasBalance(entry) {
  return Boolean(entry?.availableWithoutBorrow > 0);
}

function convertBalanceToBase(balance, data, marketData) {
  return data.side === 'sell'
    ? balance
    : convertExecutionQuoteSizeToBaseSize(
        { ...data, size: { value: balance } },
        marketData
      );
}

async function calculateBalanceInBase(exchange, credentials, data, marketData) {
  const currency = getCurrencyBySide(data.side, marketData);
  const balances = await wallet.getBalances({ exchange, credentials });
  const entry = balances.find(({ coin }) => coin === currency);

  if (!hasBalance(entry)) {
    throw new ApiError(`No ${currency} balance found`);
  }

  const balance = new BigNumber(entry.availableWithoutBorrow);
  const balanceInBase = convertBalanceToBase(balance, data, marketData);

  return calculateSizeMinusFee(exchange, credentials, balanceInBase);
}

async function calculateSpotRelativeSize(
  exchange,
  credentials,
  data,
  marketData
) {
  if (data.sizeHook.value !== 'default') {
    throw new ApiError('Orders cannot be sized by position in spot markets');
  }

  const hook = await calculateBalanceInBase(
    exchange,
    credentials,
    data,
    marketData
  );

  return data.size.value(hook);
}

export { calculateSpotRelativeSize };
