import BigNumber from 'bignumber.js';
import { InvalidOptionArgumentError } from 'commander';

const defaultOptions = {
  allowPositive: true,
  allowNegative: true,
  allowZero: true,
  allowFloat: true,
  allowShorthand: true,
};

function normaliseOptions(options) {
  return {
    ...defaultOptions,
    ...options,
  };
}

function isShorthand(number) {
  return ['k', 'm'].some((character) => number.includes(character));
}

function parseShorthandParts([, number, character]) {
  return {
    number: new BigNumber(number),
    multiplier: character === 'm' ? 1_000_000 : 1000,
  };
}

function parseShorthand(shorthand, errorMessage) {
  const parts = shorthand.match(/^([^km]+)([km])$/);

  if (parts == null) {
    throw new InvalidOptionArgumentError(errorMessage);
  }

  const { number, multiplier } = parseShorthandParts(parts);

  return number.multipliedBy(multiplier);
}

function calculateNumber(number, allowShorthand, errorMessage) {
  const lowercaseNumber = number.toLowerCase();
  const shouldParseShorthand = allowShorthand && isShorthand(lowercaseNumber);

  return shouldParseShorthand
    ? parseShorthand(lowercaseNumber, errorMessage)
    : new BigNumber(number);
}

function isValid(parsedNumber, options) {
  if (parsedNumber.isNaN()) {
    return false;
  }

  if (!options.allowPositive && parsedNumber.isPositive()) {
    return false;
  }

  if (!options.allowNegative && parsedNumber.isNegative()) {
    return false;
  }

  if (!options.allowZero && parsedNumber.isZero()) {
    return false;
  }

  if (!options.allowFloat && !parsedNumber.isInteger()) {
    return false;
  }

  return true;
}

function parseNumber(number, errorMessage, options = {}) {
  const normalisedOptions = normaliseOptions(options);

  const parsedNumber = calculateNumber(
    number,
    normalisedOptions.allowShorthand,
    errorMessage
  );

  if (!isValid(parsedNumber, normalisedOptions)) {
    throw new InvalidOptionArgumentError(errorMessage);
  }

  return parsedNumber;
}

export { parseNumber };
