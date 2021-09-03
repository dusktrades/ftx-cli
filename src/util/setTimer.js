import { performance } from 'perf_hooks';

function calculateNextIntervalMilliseconds(interval, current, expected) {
  const difference = expected - current;
  const nextInterval = Math.round(interval + difference);

  return Math.max(nextInterval, 0);
}

function calculateNextExpectedMilliseconds(interval) {
  return performance.now() + interval;
}

/**
 * Self-correcting, high-resolution timer to combat the drift and unreliability
 * of built-in JavaScript solutions.
 */
function setTimer({ intervalMilliseconds, callback }) {
  let currentMilliseconds = performance.now();
  let expectedMilliseconds = performance.now();
  let currentTimeout = null;

  function step() {
    currentMilliseconds = performance.now();

    const nextExpectedMilliseconds =
      calculateNextExpectedMilliseconds(intervalMilliseconds);

    if (callback != null) {
      callback();
    }

    const nextIntervalMilliseconds = calculateNextIntervalMilliseconds(
      intervalMilliseconds,
      currentMilliseconds,
      expectedMilliseconds
    );

    currentTimeout = setTimeout(step, nextIntervalMilliseconds);
    expectedMilliseconds = nextExpectedMilliseconds;
  }

  step();

  return () => clearTimeout(currentTimeout);
}

export { setTimer };
