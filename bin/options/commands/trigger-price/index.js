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

const TRIGGER_PRICE = ['--trigger-price <price>', 'trigger price', parse];

export { TRIGGER_PRICE };
