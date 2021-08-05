import { InvalidOptionArgumentError } from 'commander';

import { parsers } from './parsers/index.js';

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

const FUTURE_TYPE_MAP = [
  { parsed: 'perpetual', options: ['perpetual', 'perp'] },
  { parsed: 'future', options: ['quarterly', 'dated'] },
  { parsed: 'move', options: ['move'] },
];

const FUTURE_TYPE_CHOICES = FUTURE_TYPE_MAP.flatMap((entry) => entry.options);

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

function getParsedFutureType(type) {
  const futureTypeEntry = FUTURE_TYPE_MAP.find((entry) =>
    entry.options.includes(type)
  );

  return futureTypeEntry?.parsed;
}

function parseFutureType(value) {
  const types = value.split(',');
  const parsedValues = [];

  for (const type of types) {
    const parsedType = getParsedFutureType(type);

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
  repeat: parsers.repeat,
  currency: parsers.currency,
  size: parsers.size,
  minRate: parsers.minRate,
  spotType: parseSpotType,
  tokenLeverage: parseTokenLeverage,
  futureType: parseFutureType,
  market: parsers.market,
  side: parsers.side,
  orderType: parsers.orderType,
  price: parsers.price,
  trailValue: parsers.trailValue,
  orderCount: parsers.orderCount,
};

export { parseOption };
