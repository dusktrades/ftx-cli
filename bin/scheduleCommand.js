import cron from 'node-cron';

import { Logger } from '../src/common/index.js';
import { sleep } from '../src/util/index.js';

function logWaiting() {
  Logger.info('Waiting for schedule trigger');
}

async function scheduleCommandByDate(run, options) {
  logWaiting();
  await sleep(options.global.schedule.millisecondsUntilDate);
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
    options.global.schedule.cronExpression,
    () => runCronTask(run, options),
    composeCronOptions(options.global.schedule.timezone)
  );

  logWaiting();
}

async function scheduleCommand(run, options) {
  await (options.global.schedule.type === 'date'
    ? scheduleCommandByDate(run, options)
    : scheduleCommandByCron(run, options));
}

export { scheduleCommand };
