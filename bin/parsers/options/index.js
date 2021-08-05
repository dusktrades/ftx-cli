import { parseCurrency } from './parseCurrency.js';
import { parseMarket } from './parseMarket.js';
import { parseOrderCount } from './parseOrderCount.js';
import { parseOrderType } from './parseOrderType.js';
import { parsePrice } from './parsePrice.js';
import { parseRepeat } from './parseRepeat.js';
import { parseSide } from './parseSide.js';
import { parseSize } from './parseSize.js';
import { parseTrailValue } from './parseTrailValue.js';

const options = {
  currency: parseCurrency,
  market: parseMarket,
  orderCount: parseOrderCount,
  orderType: parseOrderType,
  price: parsePrice,
  repeat: parseRepeat,
  side: parseSide,
  size: parseSize,
  trailValue: parseTrailValue,
};

export { options };
