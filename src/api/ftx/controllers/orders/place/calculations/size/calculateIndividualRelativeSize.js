import BigNumber from 'bignumber.js';

import { convertExecutionQuoteSizeToBaseSize } from './convertExecutionQuoteSizeToBaseSize.js';

function calculateBaseBalance(data, marketData) {
  return data.side === 'sell'
    ? data.size
    : convertExecutionQuoteSizeToBaseSize(data, marketData);
}

function calculateSizeMinusFee(size, { makerFee, takerFee }) {
  const minFeeMultiplier = new BigNumber(1).minus(
    BigNumber.max(makerFee, takerFee)
  );

  const minSizeMultiplier = BigNumber.min(minFeeMultiplier, 1);

  return size.multipliedBy(minSizeMultiplier);
}

function calculateSpotSize(data, marketData, accountData) {
  const baseBalance = calculateBaseBalance(data, marketData);

  /**
   * Size needs to be sent with the fees manually subtracted, otherwise relative
   * values such as '100% of wallet balance' could be rejected because there is
   * no balance left over to pay the fee.
   */
  return calculateSizeMinusFee(baseBalance, accountData);
}

function calculateFuturesSize({ size, sizeHook }, marketPrice) {
  /**
   * - Size relative to position is already in underlying currency
   * - Size relative to collateral is in USD and needs to be converted using
   *   the current market price
   */
  return sizeHook === 'position' ? size : size.dividedBy(marketPrice);
}

function calculateIndividualRelativeSize(data, marketData, accountData) {
  const size =
    marketData.type === 'future'
      ? calculateFuturesSize(data, marketData.price)
      : calculateSpotSize(data, marketData, accountData);

  return size.toNumber();
}

export { calculateIndividualRelativeSize };
