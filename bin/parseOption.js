import { parsers } from './parsers/index.js';

const parseOption = {
  repeat: parsers.repeat,
  currency: parsers.currency,
  size: parsers.size,
  minRate: parsers.minRate,
  spotType: parsers.spotType,
  tokenLeverage: parsers.tokenLeverage,
  futureType: parsers.futureType,
  market: parsers.market,
  side: parsers.side,
  orderType: parsers.orderType,
  price: parsers.price,
  trailValue: parsers.trailValue,
  orderCount: parsers.orderCount,
};

export { parseOption };
