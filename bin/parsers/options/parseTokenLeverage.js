import { parseChoiceList } from '../helpers/parseChoiceList.js';

const TOKEN_LEVERAGES = [
  { parsed: 'BULL', options: ['3x', 'bull'] },
  { parsed: 'HALF', options: ['0.5x', 'half'] },
  { parsed: 'HEDGE', options: ['-1x', 'hedge'] },
  { parsed: 'BEAR', options: ['-3x', 'bear'] },
];

const ALLOWED_OPTIONS = TOKEN_LEVERAGES.flatMap((entry) => entry.options);

function parseTokenLeverage(tokenLeverage) {
  return parseChoiceList(
    tokenLeverage,
    TOKEN_LEVERAGES,
    `Token leverage must be a list of: ${ALLOWED_OPTIONS.join(', ')}.`
  );
}

export { parseTokenLeverage };
