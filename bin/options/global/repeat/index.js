import { InvalidOptionArgumentError } from 'commander';
import cron from 'node-cron';

import { composeOption } from '../../helpers/index.js';

function parse(repeat) {
  if (!cron.validate(repeat)) {
    throw new InvalidOptionArgumentError(
      'Repeat must be a valid cron expression.'
    );
  }

  return repeat;
}

const CONFIG = {
  FLAGS: '-z, --repeat [cron expression]',
  DESCRIPTION: 'repeat the command with optional schedule',
  PARSER: parse,
};

const REPEAT = composeOption(CONFIG);

export { REPEAT };
