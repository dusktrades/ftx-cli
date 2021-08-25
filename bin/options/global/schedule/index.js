import { InvalidOptionArgumentError } from 'commander';

import {
  differenceInMilliseconds,
  isBefore,
  isValid,
  parseISO,
} from 'date-fns';

import cron from 'node-cron';

const CRON_SHORTHANDS = {
  'every-second': '* * * * * *',
  'every-minute': '* * * * *',
  hourly: '0 * * * *',
  daily: '0 0 * * *',
  weekly: '0 0 * * 1',
  monthly: '0 0 1 * *',
  quarterly: '0 0 1 */3 *',
  yearly: '0 0 1 1 *',
};

function calculateMillisecondsUntilDate(date) {
  const currentDate = new Date();
  const scheduleDate = parseISO(date);

  if (!isValid(scheduleDate)) {
    return null;
  }

  if (isBefore(scheduleDate, currentDate)) {
    return null;
  }

  return differenceInMilliseconds(scheduleDate, currentDate);
}

function parseDate(date) {
  const millisecondsUntilDate = calculateMillisecondsUntilDate(date);

  if (millisecondsUntilDate == null) {
    return null;
  }

  return { type: 'date', millisecondsUntilDate };
}

function parseCronExpression(cronExpression) {
  const expandedShorthand = CRON_SHORTHANDS[cronExpression];

  if (expandedShorthand != null) {
    return { type: 'cron', cronExpression: expandedShorthand };
  }

  if (cron.validate(cronExpression)) {
    return { type: 'cron', cronExpression };
  }

  return null;
}

function parse(schedule) {
  const parsedDate = parseDate(schedule);

  if (parsedDate != null) {
    return parsedDate;
  }

  const parsedCronExpression = parseCronExpression(schedule);

  if (parsedCronExpression != null) {
    return parsedCronExpression;
  }

  throw new InvalidOptionArgumentError(
    'Schedule must be one of: future ISO 8601 timestamp, cron expression, cron shorthand.'
  );
}

const SCHEDULE = {
  FLAGS: '--schedule <schedule>',
  DESCRIPTION:
    'Schedule command to run at a future date and time or periodically, according to a given interval, until manually aborted.',
  PARSER: parse,
};

export { SCHEDULE };
