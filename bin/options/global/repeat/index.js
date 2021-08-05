import { InvalidOptionArgumentError } from 'commander';
import cron from 'node-cron';

function parse(repeat) {
  if (!cron.validate(repeat)) {
    throw new InvalidOptionArgumentError(
      'Repeat must be a valid cron expression.'
    );
  }

  return repeat;
}

const REPEAT = [
  '-z, --repeat [cron expression]',
  'repeat the command with optional schedule',
  parse,
];

export { REPEAT };
