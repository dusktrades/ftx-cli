import BigNumber from 'bignumber.js';
import { InvalidOptionArgumentError } from 'commander';

import { parseNumber } from './parseNumber.js';

function parseNumbers(numbers, errorMessage, numberOptions) {
  return numbers.map((number) =>
    parseNumber(number, errorMessage, numberOptions)
  );
}

function composeNumberRange(numbers, errorMessage, numberOptions) {
  const parsedNumbers = parseNumbers(numbers, errorMessage, numberOptions);

  return {
    from: BigNumber.min(...parsedNumbers),
    to: BigNumber.max(...parsedNumbers),
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
