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

function isThousandNumberShorthand(number) {
  return /^-?\d+(?:\.\d+)?k$/i.test(number);
}

function parseThousandNumberShorthand(numberShorthand) {
  const [multiplier] = numberShorthand.split(/k/i);

  return new BigNumber(multiplier).multipliedBy(1000);
}

function isMillionNumberShorthand(number) {
  return /^-?\d+(?:\.\d+)?m$/i.test(number);
}

function parseMillionNumberShorthand(numberShorthand) {
  const [multiplier] = numberShorthand.split(/m/i);

  return new BigNumber(multiplier).multipliedBy(1_000_000);
}

function parseNumberShorthand(number, allowShorthand) {
  if (allowShorthand && isThousandNumberShorthand(number)) {
    return parseThousandNumberShorthand(number);
  }

  if (allowShorthand && isMillionNumberShorthand(number)) {
    return parseMillionNumberShorthand(number);
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

  const parsedNumber = parseNumberShorthand(
    number,
    normalisedOptions.allowShorthand
  );

  if (!isValid(parsedNumber, normalisedOptions)) {
    throw new InvalidOptionArgumentError(errorMessage);
  }

  return parsedNumber;
}

export { parseNumber };
