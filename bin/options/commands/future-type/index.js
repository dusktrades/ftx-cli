import { parseChoiceList } from '../../helpers/index.js';

// TODO: Remove deprecated options: `perp`, `dated`.
const FUTURE_TYPES = [
  { parsed: 'perpetual', options: ['perpetual', 'p', 'perp'] },
  { parsed: 'future', options: ['quarterly', 'q', 'dated'] },
  { parsed: 'move', options: ['move', 'm'] },
];

const ALLOWED_OPTIONS = FUTURE_TYPES.flatMap((entry) => entry.options);

function parse(futureType) {
  return parseChoiceList(
    futureType,
    FUTURE_TYPES,
    `Future type must be a list of: ${ALLOWED_OPTIONS.join(', ')}.`
  );
}

const FUTURE_TYPE = {
  name: 'type',
  flags: '-t, --type <type>',
  description: 'Future type(s).',
  parser: parse,
};

export { FUTURE_TYPE };
