import { parsers } from './parsers/index.js';

const parseOption = {
  currency: parsers.currency,
  futureType: parsers.futureType,
  market: parsers.market,
  minRate: parsers.minRate,
  orderCount: parsers.orderCount,
  orderType: parsers.orderType,
  price: parsers.price,
  quoteCurrency: parsers.quoteCurrency,
  repeat: parsers.repeat,
  side: parsers.side,
  size: parsers.size,
  spotType: parsers.spotType,
  tokenLeverage: parsers.tokenLeverage,
  trailValue: parsers.trailValue,
  triggerPrice: parsers.triggerPrice,
};

export { parseOption };
