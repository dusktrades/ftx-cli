import { parseNumber } from '../../helpers/index.js';

function parse(orderInterval) {
  return parseNumber(
    orderInterval,
    'Order interval must be an integer greater than zero.',
    {
      allowNegative: false,
      allowZero: false,
      allowFloat: false,
    }
  ).toNumber();
}

const ORDER_INTERVAL = {
  FLAGS: '--order-interval <interval (ms)>',
  DESCRIPTION: 'order placement rate limit interval (ms)',
  PARSER: parse,
};

export { ORDER_INTERVAL };
