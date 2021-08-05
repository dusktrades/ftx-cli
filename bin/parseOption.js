import BigNumber from 'bignumber.js';
import { InvalidOptionArgumentError } from 'commander';

import { isPositiveFloat } from '../src/util/index.js';
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

const SIDE_MAP = [
  { parsed: 'buy', options: ['b', 'buy'] },
  { parsed: 'sell', options: ['s', 'sell'] },
];

const SIDE_CHOICES = SIDE_MAP.flatMap((entry) => entry.options);

const ORDER_TYPE_MAP = [
  { parsed: 'market', options: ['m', 'market'] },
  { parsed: 'limit', options: ['l', 'limit'] },
  { parsed: 'stop-market', options: ['sm', 'stop-market'] },
  { parsed: 'stop-limit', options: ['sl', 'stop-limit'] },
  { parsed: 'trailing-stop', options: ['ts', 'trailing-stop'] },
  { parsed: 'take-profit-market', options: ['tpm', 'take-profit-market'] },
  { parsed: 'take-profit-limit', options: ['tpl', 'take-profit-limit'] },
];

const ORDER_TYPE_CHOICES = ORDER_TYPE_MAP.flatMap((entry) => entry.options);

function parseCurrency(value) {
  return value.split(',').map((entry) => entry.toUpperCase());
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

function parseMarket(value) {
  return value.toUpperCase();
}

function getParsedSide(side) {
  const sideEntry = SIDE_MAP.find((entry) => entry.options.includes(side));

  return sideEntry?.parsed;
}

function parseSide(value) {
  const parsedSide = getParsedSide(value);

  if (parsedSide == null) {
    throw new InvalidOptionArgumentError(
      `Allowed choices are ${SIDE_CHOICES.join(', ')}.`
    );
  }

  return parsedSide;
}

function getParsedOrderType(orderType) {
  const orderTypeEntry = ORDER_TYPE_MAP.find((entry) =>
    entry.options.includes(orderType)
  );

  return orderTypeEntry?.parsed;
}

function parseOrderType(value) {
  const parsedOrderType = getParsedOrderType(value);

  if (parsedOrderType == null) {
    throw new InvalidOptionArgumentError(
      `Allowed choices are ${ORDER_TYPE_CHOICES.join(', ')}.`
    );
  }

  return parsedOrderType;
}

function parseTrailValue(value) {
  const trailValue = new BigNumber(value);

  if (trailValue.isNaN()) {
    throw new InvalidOptionArgumentError('Not an accepted trail value format.');
  }

  return trailValue;
}

const parseOption = {
  repeat: parsers.repeat,
  currency: parseCurrency,
  size: parsers.size,
  minRate: parseMinRate,
  spotType: parseSpotType,
  tokenLeverage: parseTokenLeverage,
  futureType: parseFutureType,
  market: parseMarket,
  side: parseSide,
  orderType: parseOrderType,
  price: parsers.price,
  trailValue: parseTrailValue,
  orderCount: parsers.orderCount,
};

export { parseOption };
