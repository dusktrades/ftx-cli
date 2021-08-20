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

const REPEAT = {
  FLAGS: '-z, --repeat [cron expression]',
  DESCRIPTION: 'repeat the command with optional schedule',
  PARSER: parse,
};

export { REPEAT };
