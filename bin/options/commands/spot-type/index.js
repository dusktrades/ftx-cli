import { parseChoiceList } from '../../helpers/index.js';

/**
 * TODO: Remove deprecated options: `leveraged-token`, `lev`,
 * `volatility-token`, `vol`, `equity-token`.
 */
const SPOT_TYPES = [
  { parsed: 'coin', options: ['coin', 'c'] },
  { parsed: 'fiat', options: ['fiat', 'f'] },
  {
    parsed: 'leveraged',
    options: ['leveraged', 'l', 'leveraged-token', 'lev'],
  },
  {
    parsed: 'volatility',
    options: ['volatility', 'v', 'volatility-token', 'vol'],
  },
  { parsed: 'stock', options: ['stock', 's', 'equity-token'] },
];

const ALLOWED_OPTIONS = SPOT_TYPES.flatMap((entry) => entry.options);

function parse(spotType) {
  return parseChoiceList(
    spotType,
    SPOT_TYPES,
    `Spot type must be a list of: ${ALLOWED_OPTIONS.join(', ')}.`
  );
}

const SPOT_TYPE = {
  FLAGS: '-t, --type <type>',
  DESCRIPTION: 'Spot type(s).',
  PARSER: parse,
};

export { SPOT_TYPE };
