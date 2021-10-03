import cron from 'node-cron';

import { Logger } from '../src/common/index.js';
import { sleep } from '../src/util/index.js';

function logWaiting() {
  Logger.info('Waiting for schedule trigger');
}

async function scheduleCommandByDate(run, options) {
  logWaiting();
  await sleep(options.schedule.millisecondsUntilDate);
  await run(options);
}

function composeCronOptions(timezone) {
  return {
    scheduled: true,
    ...(timezone != null && { timezone }),
  };
}

async function runCronTask(run, options) {
  await run(options);
  logWaiting();
}

async function scheduleCommandByCron(run, options) {
  // TODO: Add method of ending schedule (e.g. `--schedule-end`).
  cron.schedule(
    options.schedule.cronExpression,
    () => runCronTask(run, options),
    composeCronOptions(options.schedule.timezone)
  );

  logWaiting();
}

async function scheduleCommand(run, options) {
  await (options.schedule.type === 'date'
    ? scheduleCommandByDate(run, options)
    : scheduleCommandByCron(run, options));
}

export { scheduleCommand };
