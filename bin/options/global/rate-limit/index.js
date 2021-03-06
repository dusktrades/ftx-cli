import { InvalidOptionArgumentError } from 'commander';

import { parseNumber } from '../../helpers/index.js';

const errorMessage =
  'Rate limit must be two integers greater than zero (format: X/Y).';

function parseRateLimitNumber(number) {
  return parseNumber(number, errorMessage, {
    allowNegative: false,
    allowZero: false,
    allowFloat: false,
  }).toNumber();
}

function parse(rateLimit) {
  const numbers = rateLimit.split('/');

  if (numbers.length !== 2) {
    throw new InvalidOptionArgumentError(errorMessage);
  }

  return {
    limitPerInterval: parseRateLimitNumber(numbers[0]),
    intervalMilliseconds: parseRateLimitNumber(numbers[1]),
  };
}

const RATE_LIMIT = {
  name: 'rateLimit',
  flags: '--rate-limit <rate limit>',
  description:
    'Advanced users only. Order placement rate limit, denoted as request limit per interval (milliseconds).',
  parser: parse,
  isConfigurable: true,
};

export { RATE_LIMIT };
