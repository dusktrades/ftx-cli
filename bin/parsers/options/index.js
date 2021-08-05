import { parseOrderCount } from './parseOrderCount.js';
import { parsePrice } from './parsePrice.js';
import { parseSize } from './parseSize.js';

const options = {
  orderCount: parseOrderCount,
  price: parsePrice,
  size: parseSize,
};

export { options };
