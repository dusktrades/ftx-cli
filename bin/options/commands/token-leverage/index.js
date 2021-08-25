import { parseChoiceList } from '../../helpers/index.js';

const TOKEN_LEVERAGES = [
  { parsed: 'BULL', options: ['3x', 'bull'] },
  { parsed: 'HALF', options: ['0.5x', 'half'] },
  { parsed: 'HEDGE', options: ['-1x', 'hedge'] },
  { parsed: 'BEAR', options: ['-3x', 'bear'] },
];

const ALLOWED_OPTIONS = TOKEN_LEVERAGES.flatMap((entry) => entry.options);

function parse(tokenLeverage) {
  return parseChoiceList(
    tokenLeverage,
    TOKEN_LEVERAGES,
    `Token leverage must be a list of: ${ALLOWED_OPTIONS.join(', ')}.`
  );
}

const TOKEN_LEVERAGE = {
  FLAGS: '--token-leverage <leverage>',
  DESCRIPTION: 'Token leverage name(s) or multiplier(s).',
  PARSER: parse,
};

export { TOKEN_LEVERAGE };
