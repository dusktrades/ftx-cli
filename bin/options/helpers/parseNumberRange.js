import { InvalidOptionArgumentError } from 'commander';

import { parseNumber } from './parseNumber.js';

function composeNumberRange(numbers, errorMessage, numberOptions) {
  return {
    from: parseNumber(numbers[0], errorMessage, numberOptions),
    to: parseNumber(numbers[1], errorMessage, numberOptions),
  };
}

function parseNumberRange(numberRange, errorMessage, numberOptions) {
  const numbers = numberRange.split(':');

  if (numbers.length !== 2) {
    throw new InvalidOptionArgumentError(errorMessage);
  }

  return composeNumberRange(numbers, errorMessage, numberOptions);
}

export { parseNumberRange };
