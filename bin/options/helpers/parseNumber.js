import BigNumber from 'bignumber.js';
import { InvalidOptionArgumentError } from 'commander';

const DEFAULT_OPTIONS = {
  allowPositive: true,
  allowNegative: true,
  allowZero: true,
  allowFloat: true,
  allowShorthand: true,
};

function normaliseOptions(options) {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
  };
}

function isThousandShorthandNumber(number) {
  return /^\d+(?:\.\d+)?k$/i.test(number);
}

function parseThousandShorthandNumber(shorthandNumber) {
  const [multiplier] = shorthandNumber.split(/k/i);

  return new BigNumber(multiplier).multipliedBy(new BigNumber(1000));
}

function isMillionShorthandNumber(number) {
  return /^\d+(?:\.\d+)?m$/i.test(number);
}

function parseMillionShorthandNumber(shorthandNumber) {
  const [multiplier] = shorthandNumber.split(/m/i);

  return new BigNumber(multiplier).multipliedBy(new BigNumber(1_000_000));
}

function parseShorthandNumber(number, allowShorthand) {
  if (allowShorthand && isThousandShorthandNumber(number)) {
    return parseThousandShorthandNumber(number);
  }

  if (allowShorthand && isMillionShorthandNumber(number)) {
    return parseMillionShorthandNumber(number);
  }

  return new BigNumber(number);
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

  const parsedNumber = parseShorthandNumber(
    number,
    normalisedOptions.allowShorthand
  );

  if (!isValid(parsedNumber, normalisedOptions)) {
    throw new InvalidOptionArgumentError(errorMessage);
  }

  return parsedNumber;
}

export { parseNumber };
