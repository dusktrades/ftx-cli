import { InvalidOptionArgumentError } from 'commander';

import { parseNumber } from '../../helpers/index.js';

const errorMessage =
  'Rate limit must match the following format, where X (per-interval request limit) and Y (interval in milliseconds) are integers greater than zero: X/Y (e.g. 6/200)';

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
    intervalLimit: parseRateLimitNumber(numbers[0]),
    intervalMs: parseRateLimitNumber(numbers[1]),
  };
}

const RATE_LIMIT = {
  FLAGS: '--rate-limit <rate limit>',
  DESCRIPTION: 'order placement rate limit',
  PARSER: parse,
};

export { RATE_LIMIT };
