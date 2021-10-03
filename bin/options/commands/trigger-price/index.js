import { parseNumber } from '../../helpers/index.js';

function parse(triggerPrice) {
  return parseNumber(
    triggerPrice,
    'Trigger price must be a number greater than zero.',
    {
      allowNegative: false,
      allowZero: false,
    }
  );
}

const TRIGGER_PRICE = {
  name: 'triggerPrice',
  flags: '--trigger-price <price>',
  description: 'Price that triggers stop or take profit orders.',
  parser: parse,
};

export { TRIGGER_PRICE };
