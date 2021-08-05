import { parseChoiceList } from '../../helpers/index.js';

const FUTURE_TYPES = [
  { parsed: 'perpetual', options: ['perp', 'perpetual'] },
  { parsed: 'future', options: ['dated', 'quarterly'] },
  { parsed: 'move', options: ['move'] },
];

const ALLOWED_OPTIONS = FUTURE_TYPES.flatMap((entry) => entry.options);

function parse(futureType) {
  return parseChoiceList(
    futureType,
    FUTURE_TYPES,
    `Future type must be a list of: ${ALLOWED_OPTIONS.join(', ')}.`
  );
}

const FUTURE_TYPE = ['-t, --type <type>', 'future type(s)', parse];

export { FUTURE_TYPE };
