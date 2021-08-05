import { parseNumber } from '../helpers/index.js';

function parseOrderCount(orderCount) {
  return parseNumber(
    orderCount,
    'Order count must be an integer greater than 0.',
    {
      allowNegative: false,
      allowZero: false,
      allowFloat: false,
    }
  );
}

export { parseOrderCount };
