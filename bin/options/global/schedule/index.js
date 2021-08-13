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
  const cronShorthand = CRON_SHORTHANDS[cronExpression];

  if (cronShorthand != null) {
    return { type: 'cron', cronExpression: cronShorthand };
  }

  if (cron.validate(cronExpression)) {
    return { type: 'cron', cronExpression };
  }

  return cronExpression;
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
    'Schedule must be a valid ISO 8601 date in the future (YYYY-MM-DDThh:mm:ss, e.g. 2030-01-01T00:00:00), cron shorthand (e.g. daily), or cron expression (e.g. * * * * * *)'
  );
}

const SCHEDULE = {
  FLAGS: '--schedule <schedule>',
  DESCRIPTION: 'run command at a given date and time or repeating schedule',
  PARSER: parse,
};

export { SCHEDULE };
