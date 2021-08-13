import BigNumber from 'bignumber.js';
import { InvalidOptionArgumentError } from 'commander';

import { parseNumber } from '../../helpers/index.js';

const ERROR_MESSAGE =
  'Duration must be a subset of the following format, where X, Y, and Z are integers greater than zero: XhYmZs (e.g. 1h2m3s, 1h2m, 1h)';

// TODO: Move to util constants/conversion functions.
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const MILLISECONDS_PER_MINUTE = MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE;
const MILLISECONDS_PER_HOUR = MILLISECONDS_PER_MINUTE * MINUTES_PER_HOUR;

function isValid(duration) {
  return /^(\d+h)?(\d+m)?(\d+s)?$/i.test(duration);
}

function parseDurationPart(duration, regex) {
  const number = duration.match(regex)?.[1];

  if (number == null) {
    return new BigNumber(0);
  }

  return parseNumber(number, ERROR_MESSAGE, {
    allowNegative: false,
    allowZero: false,
    allowFloat: false,
    allowShorthand: false,
  });
}

function parseDurationParts(duration) {
  return {
    hours: parseDurationPart(duration, /(\d+)h/i),
    minutes: parseDurationPart(duration, /(\d+)m/i),
    seconds: parseDurationPart(duration, /(\d+)s/i),
  };
}

function calculateDurationMilliseconds(durationParts) {
  return durationParts.hours
    .multipliedBy(MILLISECONDS_PER_HOUR)
    .plus(durationParts.minutes.multipliedBy(MILLISECONDS_PER_MINUTE))
    .plus(durationParts.seconds.multipliedBy(MILLISECONDS_PER_SECOND));
}

function parse(duration) {
  if (!isValid(duration)) {
    throw new InvalidOptionArgumentError(ERROR_MESSAGE);
  }

  const durationParts = parseDurationParts(duration);

  return calculateDurationMilliseconds(durationParts);
}

const DURATION = {
  FLAGS: '--duration <duration>',
  DESCRIPTION: 'TWAP order placement duration',
  PARSER: parse,
  DEFAULT: new BigNumber(0),
};

export { DURATION };
