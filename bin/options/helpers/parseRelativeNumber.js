import BigNumber from 'bignumber.js';
import { InvalidOptionArgumentError } from 'commander';

import { parseNumber } from './parseNumber.js';

function parseOperator(sign, errorMessage) {
  if (sign == null) {
    throw new InvalidOptionArgumentError(errorMessage);
  }

  return sign === '-' ? 'minus' : 'plus';
}

function parseIsPercentage(percentage) {
  return Boolean(percentage);
}

function parseAdditiveParts(relativeNumber, errorMessage) {
  const parts = relativeNumber.match(/^([+-])([^%]+)(%)?$/);

  if (parts == null) {
    throw new InvalidOptionArgumentError(errorMessage);
  }

  return {
    operator: parseOperator(parts[1]),
    number: parseNumber(parts[2], errorMessage, { allowZero: false }),
    isPercentage: parseIsPercentage(parts[3]),
  };
}

function parseAdditiveRelativeNumber(relativeNumber, errorMessage) {
  const { operator, number, isPercentage } = parseAdditiveParts(
    relativeNumber,
    errorMessage
  );

  return (hook) => {
    const term = isPercentage
      ? hook.multipliedBy(number.dividedBy(100))
      : number;

    return hook[operator](term);
  };
}

function parseMultiplicativeParts(relativeNumber, errorMessage) {
  const parts = relativeNumber.match(/^([^%]+)(%)$/);

  if (parts == null) {
    throw new InvalidOptionArgumentError(errorMessage);
  }

  return {
    number: parseNumber(parts[1], errorMessage, {
      allowNegative: false,
      allowZero: false,
    }),
  };
}

function parseMultiplicativeRelativeNumber(relativeNumber, errorMessage) {
  const { number } = parseMultiplicativeParts(relativeNumber, errorMessage);

  return (hook) => new BigNumber(hook).multipliedBy(number.dividedBy(100));
}

function parseRelativeNumber(relativeNumber, errorMessage, type) {
  return type === 'additive'
    ? parseAdditiveRelativeNumber(relativeNumber, errorMessage)
    : parseMultiplicativeRelativeNumber(relativeNumber, errorMessage);
}

export { parseRelativeNumber };
