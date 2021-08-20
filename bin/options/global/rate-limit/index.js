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
    intervalLimit: parseRateLimitNumber(numbers[0]),
    intervalMs: parseRateLimitNumber(numbers[1]),
  };
}

const RATE_LIMIT = {
  FLAGS: '--rate-limit <rate limit>',
  DESCRIPTION:
    'Advanced users only. Order placement rate limit, denoted as request limit per interval (milliseconds).',
  PARSER: parse,
};

export { RATE_LIMIT };
