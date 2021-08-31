import { parseChoiceList } from '../../helpers/index.js';

const TOKEN_LEVERAGES = [
  { parsed: 'BULL', options: ['bull', '3x'] },
  { parsed: 'HALF', options: ['half', '0.5x'] },
  { parsed: 'HEDGE', options: ['hedge', '-1x'] },
  { parsed: 'BEAR', options: ['bear', '-3x'] },
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
