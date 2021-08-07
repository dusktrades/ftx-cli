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
  FLAGS: '--trigger-price <price>',
  DESCRIPTION: 'trigger price',
  PARSER: parse,
};

export { TRIGGER_PRICE };
