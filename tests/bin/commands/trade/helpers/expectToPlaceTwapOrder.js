import { performance } from 'perf_hooks';
import { createInterface } from 'readline';

import { composeCommand } from './composeCommand.js';
import { spawnTestChild } from './spawnTestChild.js';

/**
 * Calculate the number of milliseconds between the 'Placed order' logs of the
 * two orders.
 */
function calculateOrderIntervalMilliseconds(order1Timestamp, order2Timestamp) {
  return order2Timestamp - order1Timestamp;
}

/**
 * Calculate the absolute number of milliseconds between the expected interval
 * (1 second) and the actual, calculated interval.
 */
function calculateExpectationOffsetMilliseconds([
  ,
  order1Timestamp,
  order2Timestamp,
]) {
  const orderIntervalMilliseconds = calculateOrderIntervalMilliseconds(
    order1Timestamp,
    order2Timestamp
  );

  return Math.abs(orderIntervalMilliseconds - 1000);
}

async function expectToPlaceTwapOrder(baseOptions) {
  const options = `${baseOptions} --split 2 --duration 1s`;
  const command = composeCommand(options);
  const child = spawnTestChild(command);

  const matchedStdoutTimestamps = [];
  let matchedStderrCount = 0;

  const stdoutReader = createInterface({ input: child.stdout });
  const stderrReader = createInterface({ input: child.stderr });

  const expectedStdoutArray = [
    /.{24} {2}INFO {3}Processing order\(s\)/,
    /.{24} {2}INFO {5}Placed order/,
    /.{24} {2}INFO {5}Placed order/,
    /.{24} {2}INFO {3}Placed order\(s\)/,
  ];

  stdoutReader.on('line', (line) => {
    const timestamp = performance.now();
    const matchedStdoutCount = matchedStdoutTimestamps.length;
    const expectedLine = expectedStdoutArray[matchedStdoutCount];

    expect(line).toMatch(expectedLine);
    matchedStdoutTimestamps.push(timestamp);
  });

  stderrReader.on('line', () => {
    matchedStderrCount += 1;
  });

  return new Promise((resolve, reject) => {
    child.on('close', (exitCode) => {
      const expectationOffsetMilliseconds =
        calculateExpectationOffsetMilliseconds(matchedStdoutTimestamps);

      try {
        expect(expectationOffsetMilliseconds).toBeLessThan(50);
        expect(matchedStderrCount).toBe(0);
        expect(exitCode).toBe(0);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

export { expectToPlaceTwapOrder };
