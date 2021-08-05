import { parseNumber } from '../helpers/index.js';

function parseTriggerPrice(triggerPrice) {
  return parseNumber(
    triggerPrice,
    'Trigger price must be a number greater than zero.',
    {
      allowNegative: false,
      allowZero: false,
    }
  );
}

export { parseTriggerPrice };
