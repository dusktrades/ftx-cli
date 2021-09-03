import { performance } from 'perf_hooks';

function calculateNext(interval, current, expected) {
  const difference = expected - current;
  const nextInterval = Math.round(interval + difference);

  return {
    nextIntervalMilliseconds: Math.max(nextInterval, 0),
    nextExpectedMilliseconds: expected + interval,
  };
}

/**
 * Self-correcting, high-resolution timer to combat the drift and unreliability
 * of built-in JavaScript solutions.
 */
function setTimer({
  intervalMilliseconds,
  expectedMilliseconds = performance.now(),
  callback,
}) {
  const currentMilliseconds = performance.now();

  if (callback != null) {
    callback();
  }

  const { nextIntervalMilliseconds, nextExpectedMilliseconds } = calculateNext(
    intervalMilliseconds,
    currentMilliseconds,
    expectedMilliseconds
  );

  function setNextTimer() {
    setTimer({
      intervalMilliseconds,
      expectedMilliseconds: nextExpectedMilliseconds,
      callback,
    });
  }

  setTimeout(setNextTimer, nextIntervalMilliseconds);
}

export { setTimer };
