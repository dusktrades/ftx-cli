import { parseChoice } from './parseChoice.js';

const flags = '--sort <method>';

function parse(sortBy, choices) {
  return parseChoice(
    sortBy,
    choices,
    `${flags} must be one of: ${choices.join(', ')}`
  );
}

function composeSortOption(choices) {
  return {
    flags,
    description: 'Sorting method.',
    parser: (sortBy) => parse(sortBy, choices),
  };
}

export { composeSortOption };
