import { parseMarket } from './parseMarket.js';
import { parseOrderCount } from './parseOrderCount.js';
import { parsePrice } from './parsePrice.js';
import { parseRepeat } from './parseRepeat.js';
import { parseSize } from './parseSize.js';

const options = {
  market: parseMarket,
  orderCount: parseOrderCount,
  price: parsePrice,
  repeat: parseRepeat,
  size: parseSize,
};

export { options };
