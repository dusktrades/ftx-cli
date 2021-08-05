import { InvalidOptionArgumentError } from 'commander';
import cron from 'node-cron';

function parseRepeat(repeat) {
  if (!cron.validate(repeat)) {
    throw new InvalidOptionArgumentError(
      'Repeat must be a valid cron expression.'
    );
  }

  return repeat;
}

export { parseRepeat };
