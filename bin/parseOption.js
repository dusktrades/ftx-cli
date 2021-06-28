import { InvalidOptionArgumentError } from 'commander';
import cron from 'node-cron';

import { isPositiveFloat } from '../src/util/index.js';

const FUTURE_TYPE_MAP = [
  { parsed: 'perpetual', options: ['perpetual', 'perp'] },
  { parsed: 'future', options: ['quarterly', 'dated'] },
  { parsed: 'move', options: ['move'] },
];

const FUTURE_TYPE_CHOICES = FUTURE_TYPE_MAP.flatMap((entry) => entry.options);

function parseRepeat(value) {
  if (!cron.validate(value)) {
    throw new InvalidOptionArgumentError(
      'Not an accepted cron expression format.'
    );
  }

  return value;
}

function parseCurrency(value) {
  return value.split(',').map((entry) => entry.toUpperCase());
}

function parseThousandString(value) {
  const [multiplier] = value.split(/[kK]/);

  return Number.parseFloat(multiplier) * 1000;
}

function parseMillionString(value) {
  const [multiplier] = value.split(/[mM]/);

  return Number.parseFloat(multiplier) * 1_000_000;
}

function parseSize(value) {
  const thousandMatch = value.match(/^\d+(?:\.\d+)?[kK]$/);

  if (thousandMatch != null) {
    return parseThousandString(thousandMatch[0]);
  }

  const millionMatch = value.match(/^\d+(?:\.\d+)?[mM]$/);

  if (millionMatch != null) {
    return parseMillionString(millionMatch[0]);
  }

  if (!isPositiveFloat(value)) {
    throw new InvalidOptionArgumentError('Not an accepted size format.');
  }

  return Number.parseFloat(value);
}

function parseMinRate(value) {
  if (!isPositiveFloat(value)) {
    throw new InvalidOptionArgumentError(
      'Not an accepted minimum rate format.'
    );
  }

  return Number.parseFloat(value);
}

function getParsedType(type) {
  const futureTypeEntry = FUTURE_TYPE_MAP.find((entry) =>
    entry.options.includes(type)
  );

  return futureTypeEntry?.parsed;
}

function parseFutureType(value) {
  const types = value.split(',');
  const parsedValues = [];

  for (const type of types) {
    const parsedType = getParsedType(type);

    if (parsedType == null) {
      throw new InvalidOptionArgumentError(
        `Allowed choices are ${FUTURE_TYPE_CHOICES.join(', ')}.`
      );
    }

    if (!parsedValues.includes(parsedType)) {
      parsedValues.push(parsedType);
    }
  }

  return parsedValues;
}

const parseOption = {
  repeat: parseRepeat,
  currency: parseCurrency,
  size: parseSize,
  minRate: parseMinRate,
  futureType: parseFutureType,
};

export { parseOption };
