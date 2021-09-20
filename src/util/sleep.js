import { promisify } from 'util';

import { MAX_32_BIT_INTEGER } from './max32BitInteger.js';

const setTimeoutPromise = promisify(setTimeout);

async function sleepMaxDuration() {
  await setTimeoutPromise(MAX_32_BIT_INTEGER);
}

async function sleep(milliseconds) {
  const normalisedMilliseconds = Math.max(milliseconds, 0);

  if (normalisedMilliseconds === 0) {
    return;
  }

  async function lapSleep() {
    const remainingMilliseconds = normalisedMilliseconds - MAX_32_BIT_INTEGER;

    await sleepMaxDuration();
    await sleep(remainingMilliseconds);
  }

  await (normalisedMilliseconds > MAX_32_BIT_INTEGER
    ? lapSleep()
    : setTimeoutPromise(normalisedMilliseconds));
}

export { sleep };
