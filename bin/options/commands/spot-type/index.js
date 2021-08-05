import { parseChoiceList } from '../../helpers/parseChoiceList.js';

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

const SPOT_TYPE = ['-t, --type <type>', 'spot type(s)', parse];

export { SPOT_TYPE };
