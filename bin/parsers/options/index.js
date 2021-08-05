import { parseCurrency } from './parseCurrency.js';
import { parseFutureType } from './parseFutureType.js';
import { parseMarket } from './parseMarket.js';
import { parseMinRate } from './parseMinRate.js';
import { parseOrderCount } from './parseOrderCount.js';
import { parseOrderType } from './parseOrderType.js';
import { parsePrice } from './parsePrice.js';
import { parseRepeat } from './parseRepeat.js';
import { parseSide } from './parseSide.js';
import { parseSize } from './parseSize.js';
import { parseSpotType } from './parseSpotType.js';
import { parseTrailValue } from './parseTrailValue.js';

const options = {
  currency: parseCurrency,
  futureType: parseFutureType,
  market: parseMarket,
  minRate: parseMinRate,
  orderCount: parseOrderCount,
  orderType: parseOrderType,
  price: parsePrice,
  repeat: parseRepeat,
  side: parseSide,
  size: parseSize,
  spotType: parseSpotType,
  trailValue: parseTrailValue,
};

export { options };
