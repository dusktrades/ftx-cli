import { InvalidOptionArgumentError } from 'commander';
import cron from 'node-cron';

import { isPositiveFloat } from '../src/util/index.js';

const SPOT_TYPE_MAP = [
  { parsed: 'coin', options: ['coin'] },
  { parsed: 'fiat', options: ['fiat'] },
  { parsed: 'leveraged-token', options: ['lev', 'leveraged-token'] },
  { parsed: 'volatility-token', options: ['vol', 'volatility-token'] },
  { parsed: 'equity-token', options: ['stock', 'equity-token'] },
];

const SPOT_TYPE_CHOICES = SPOT_TYPE_MAP.flatMap((entry) => entry.options);

const TOKEN_LEVERAGE_MAP = [
  { parsed: 'BEAR', options: ['-3x', 'bear'] },
  { parsed: 'BULL', options: ['3x', 'bull'] },
  { parsed: 'HALF', options: ['0.5x', 'half'] },
  { parsed: 'HEDGE', options: ['-1x', 'hedge'] },
];

const TOKEN_LEVERAGE_CHOICES = TOKEN_LEVERAGE_MAP.flatMap(
  (entry) => entry.options
);

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

function getParsedSpotType(type) {
  const spotTypeEntry = SPOT_TYPE_MAP.find((entry) =>
    entry.options.includes(type)
  );

  return spotTypeEntry?.parsed;
}

function parseSpotType(value) {
  const types = value.split(',');
  const parsedValues = [];

  for (const type of types) {
    const parsedType = getParsedSpotType(type);

    if (parsedType == null) {
      throw new InvalidOptionArgumentError(
        `Allowed choices are ${SPOT_TYPE_CHOICES.join(', ')}.`
      );
    }

    if (!parsedValues.includes(parsedType)) {
      parsedValues.push(parsedType);
    }
  }

  return parsedValues;
}

// TODO: Refactor and reuse common option parsers.
function getParsedTokenLeverage(option) {
  const spotTypeEntry = TOKEN_LEVERAGE_MAP.find((entry) =>
    entry.options.includes(option)
  );

  return spotTypeEntry?.parsed;
}

function parseTokenLeverage(value) {
  const options = value.split(',');
  const parsedOptions = [];

  for (const option of options) {
    const parsedOption = getParsedTokenLeverage(option);

    if (parsedOption == null) {
      throw new InvalidOptionArgumentError(
        `Allowed choices are ${TOKEN_LEVERAGE_CHOICES.join(', ')}.`
      );
    }

    if (!parsedOptions.includes(parsedOption)) {
      parsedOptions.push(parsedOption);
    }
  }

  return parsedOptions;
}

function parseFutureType(value) {
  const choices = ['perp', 'perpetual', 'quarterly', 'dated', 'move'];

  if (['perp', 'perpetual'].includes(value)) {
    return 'perpetual';
  }

  if (['quarterly', 'dated'].includes(value)) {
    return 'future';
  }

  if (value === 'move') {
    return 'move';
  }

  throw new InvalidOptionArgumentError(
    `Allowed choices are ${choices.join(', ')}.`
  );
}

const parseOption = {
  repeat: parseRepeat,
  currency: parseCurrency,
  size: parseSize,
  minRate: parseMinRate,
  spotType: parseSpotType,
  tokenLeverage: parseTokenLeverage,
  futureType: parseFutureType,
};

export { parseOption };
