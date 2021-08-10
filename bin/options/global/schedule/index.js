import { InvalidOptionArgumentError } from 'commander';
import { differenceInMilliseconds, isBefore, parseISO } from 'date-fns';
import cron from 'node-cron';

const ERROR_MESSAGE =
  'Schedule must be a valid, future ISO date (YYYY-MM-DDThh:mm:ss, e.g. 2030-01-01T00:00:00) or cron expression (e.g. * * * * * *)';

function calculateMillisecondsUntilDate(date) {
  const currentDate = new Date();
  const scheduleDate = parseISO(date);

  if (isBefore(scheduleDate, currentDate)) {
    throw new InvalidOptionArgumentError(ERROR_MESSAGE);
  }

  return differenceInMilliseconds(scheduleDate, currentDate);
}

function parseDate(date) {
  return {
    type: 'date',
    millisecondsUntilDate: calculateMillisecondsUntilDate(date),
  };
}

function parseCronExpression(cronExpression) {
  if (!cron.validate(cronExpression)) {
    throw new InvalidOptionArgumentError(ERROR_MESSAGE);
  }

  return cronExpression;
}

function parse(schedule) {
  try {
    return parseDate(schedule);
  } catch {
    return {
      type: 'cron',
      cronExpression: parseCronExpression(schedule),
    };
  }
}

const SCHEDULE = {
  FLAGS: '--schedule <schedule>',
  DESCRIPTION: 'run command at a given date and time or repeating schedule',
  PARSER: parse,
};

export { SCHEDULE };
