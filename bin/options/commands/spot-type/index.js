import { parseChoiceList } from '../../helpers/index.js';

const SPOT_TYPES = [
  { parsed: 'coin', options: ['coin'] },
  { parsed: 'fiat', options: ['fiat'] },
  { parsed: 'leveraged-token', options: ['lev', 'leveraged-token'] },
  { parsed: 'volatility-token', options: ['vol', 'volatility-token'] },
  { parsed: 'equity-token', options: ['stock', 'equity-token'] },
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
