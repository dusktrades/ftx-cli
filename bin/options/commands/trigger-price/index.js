import { composeOption, parseNumber } from '../../helpers/index.js';

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

const CONFIG = {
  FLAGS: '--trigger-price <price>',
  DESCRIPTION: 'trigger price',
  PARSER: parse,
};

const TRIGGER_PRICE = composeOption(CONFIG);

export { TRIGGER_PRICE };
