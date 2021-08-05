import { InvalidOptionArgumentError } from 'commander';

import { parsers } from './parsers/index.js';

const TOKEN_LEVERAGE_MAP = [
  { parsed: 'BEAR', options: ['-3x', 'bear'] },
  { parsed: 'BULL', options: ['3x', 'bull'] },
  { parsed: 'HALF', options: ['0.5x', 'half'] },
  { parsed: 'HEDGE', options: ['-1x', 'hedge'] },
];

const TOKEN_LEVERAGE_CHOICES = TOKEN_LEVERAGE_MAP.flatMap(
  (entry) => entry.options
);

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

const parseOption = {
  repeat: parsers.repeat,
  currency: parsers.currency,
  size: parsers.size,
  minRate: parsers.minRate,
  spotType: parsers.spotType,
  tokenLeverage: parseTokenLeverage,
  futureType: parsers.futureType,
  market: parsers.market,
  side: parsers.side,
  orderType: parsers.orderType,
  price: parsers.price,
  trailValue: parsers.trailValue,
  orderCount: parsers.orderCount,
};

export { parseOption };
