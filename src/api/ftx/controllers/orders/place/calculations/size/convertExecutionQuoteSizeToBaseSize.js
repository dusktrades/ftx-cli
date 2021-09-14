import { ORDER_TYPES } from '../../../../../structures/orderTypes.js';

/**
 * Get the quote (i.e. closest to spread) depending on order side.
 *
 * - Buy: ask price
 * - Sell: bid price
 */
function getQuotedPrice(side, { bid, ask }) {
  return side === 'sell' ? bid : ask;
}

/**
 * Get the execution price depending on order execution type. Note that, for
 * market orders, this is a naive method of calculating the execution price that
 * assumes zero slippage. The FTX platform uses this method.
 *
 * - Market: current bid/ask
 * - Limit: provided/derived limit price
 */
function getExecutionPrice({ side, type, price }, marketData) {
  return ORDER_TYPES[type].executionType === 'market'
    ? getQuotedPrice(side, marketData)
    : price;
}

function convertExecutionQuoteSizeToBaseSize(orderData, marketData) {
  const executionPrice = getExecutionPrice(orderData, marketData);

  return orderData.size.value.dividedBy(executionPrice);
}

export { convertExecutionQuoteSizeToBaseSize };
