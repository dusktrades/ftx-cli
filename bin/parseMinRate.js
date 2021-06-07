import { InvalidOptionArgumentError } from 'commander';

import { isPositiveFloat } from '../src/util/index.js';

function parseMinRate(value) {
  if (!isPositiveFloat(value)) {
    throw new InvalidOptionArgumentError(
      'Not an accepted minimum rate format.'
    );
  }

  return Number.parseFloat(value);
}

export { parseMinRate };
