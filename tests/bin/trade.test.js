import { spawn } from 'child_process';
import { createInterface } from 'readline';

const SHORT_FLAG_TEST_NAME = 'SUCCEEDS: Short flag';

const TYPE_OPTION_ALIAS_ARGUMENT_TEST_NAME =
  'SUCCEEDS: Type option alias argument';

const MISSING_OPTION_TEST_NAME = 'FAILS: Missing option';
const MISSING_ARGUMENT_TEST_NAME = 'FAILS: Missing argument';
const INVALID_ARGUMENT_TEST_NAME = 'FAILS: Invalid argument';

function composeCommand(options) {
  return `node ./bin/cli.js trade ${options}`;
}

function spawnTestChild(command) {
  return spawn(command, {
    shell: true,
    env: { ...process.env, NODE_ENV: 'test-child' },
  });
}

// Matches a child process' exit code and ordered stdout/stderr.
async function expectChildToMatch(child, expectedChild) {
  let matchedStdoutCount = 0;
  let matchedStderrCount = 0;

  const stdoutReader = createInterface({ input: child.stdout });
  const stderrReader = createInterface({ input: child.stderr });

  stdoutReader.on('line', (line) => {
    expect(line).toMatch(expectedChild.stdoutArray[matchedStdoutCount]);
    matchedStdoutCount += 1;
  });

  stderrReader.on('line', (line) => {
    expect(line).toMatch(expectedChild.stderrArray[matchedStderrCount]);
    matchedStderrCount += 1;
  });

  return new Promise((resolve) => {
    child.on('close', (exitCode) => {
      // Expect the number of matches to equal the expected number of matches.
      expect(matchedStdoutCount).toBe(expectedChild.stdoutArray.length);
      expect(matchedStderrCount).toBe(expectedChild.stderrArray.length);

      expect(exitCode).toBe(expectedChild.exitCode);
      resolve();
    });
  });
}

async function expectPlaceSingleOrder(options) {
  const command = composeCommand(options);

  const expectedChild = {
    stdoutArray: [
      /.{24} {2}INFO {3}Processing order\(s\)/,
      /.{24} {2}INFO {5}Placed order/,
      /.{24} {2}INFO {3}Placed order\(s\)/,
    ],
    stderrArray: [],
    exitCode: 0,
  };

  const child = spawnTestChild(command);

  await expectChildToMatch(child, expectedChild);
}

describe('Order type: Market', () => {
  test('SUCCEEDS: Basic market order', async () => {
    const options = '--market btc-perp --side buy --type market --size 1';

    await expectPlaceSingleOrder(options);
  });

  test(TYPE_OPTION_ALIAS_ARGUMENT_TEST_NAME, async () => {
    const options = '--market btc-perp --side buy --type m --size 1';

    await expectPlaceSingleOrder(options);
  });
});

describe('Order type: Limit', () => {
  test('SUCCEEDS: Basic limit order', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 10';

    await expectPlaceSingleOrder(options);
  });

  test(TYPE_OPTION_ALIAS_ARGUMENT_TEST_NAME, async () => {
    const options = '--market btc-perp --side buy --type l --size 1 --price 10';

    await expectPlaceSingleOrder(options);
  });

  test('FAILS: Missing price option', async () => {
    const options = '--market btc-perp --side buy --type limit --size 1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [/.{24} {2}INFO {3}Processing order\(s\)/],
      stderrArray: [
        /.{24} {2}ERROR {4}Failed order: Limit orders must specify price/,
        /.{24} {2}ERROR {2}One or more orders failed to be placed/,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});

describe('Order type: Stop market', () => {
  test('SUCCEEDS: Basic stop market order', async () => {
    const options =
      '--market btc-perp --side buy --type stop-market --size 1 --trigger-price 10';

    await expectPlaceSingleOrder(options);
  });

  test(TYPE_OPTION_ALIAS_ARGUMENT_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type sm --size 1 --trigger-price 10';

    await expectPlaceSingleOrder(options);
  });

  test('FAILS: Missing trigger price option', async () => {
    const options = '--market btc-perp --side buy --type stop-market --size 1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [/.{24} {2}INFO {3}Processing order\(s\)/],
      stderrArray: [
        /.{24} {2}ERROR {4}Failed order: Stop and take profit orders must specify trigger price/,
        /.{24} {2}ERROR {2}One or more orders failed to be placed/,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});

describe('Option: Market', () => {
  test(SHORT_FLAG_TEST_NAME, async () => {
    const options = '-m btc-perp --side buy --type market --size 1';

    await expectPlaceSingleOrder(options);
  });

  test(MISSING_OPTION_TEST_NAME, async () => {
    const options = '--side buy --type market --size 1 --price 10';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: required option '-m, --market <market>' not specified/,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(MISSING_ARGUMENT_TEST_NAME, async () => {
    const options = '--market --side buy --type market --size 1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error/],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Market not found', async () => {
    const options = '--market invalid-market --side buy --type market --size 1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [/.{24} {2}INFO {3}Processing order\(s\)/],
      stderrArray: [
        /.{24} {2}ERROR {4}Failed order: No such market: INVALID-MARKET/,
        /.{24} {2}ERROR {2}One or more orders failed to be placed/,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});

describe('Option: Side', () => {
  test('SUCCEEDS: Sell argument', async () => {
    const options = '--market btc-perp --side sell --type market --size 1';

    await expectPlaceSingleOrder(options);
  });

  test('SUCCEEDS: Alias arguments', async () => {
    const aliases = ['b', 's'];

    const expectations = aliases.map((alias) => {
      const options = `--market btc-perp --side ${alias} --type market --size 1`;

      return expectPlaceSingleOrder(options);
    });

    await Promise.all(expectations);
  });

  test(MISSING_OPTION_TEST_NAME, async () => {
    const options = '--market btc-perp --type market --size 1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error: required option '--side <side>' not specified/],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(MISSING_ARGUMENT_TEST_NAME, async () => {
    const options = '--market btc-perp --side --type market --size 1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error/],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(INVALID_ARGUMENT_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side invalid-side --type market --size 1';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '--side <side>' argument 'invalid-side' is invalid\. Side must be one of: b, buy, s, sell\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});

describe('Option: Type', () => {
  test(SHORT_FLAG_TEST_NAME, async () => {
    const options = '--market btc-perp --side buy -t market --size 1';

    await expectPlaceSingleOrder(options);
  });

  test(MISSING_OPTION_TEST_NAME, async () => {
    const options = '--market btc-perp --side buy --size 1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error: required option '-t, --type <type>' not specified/],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(MISSING_ARGUMENT_TEST_NAME, async () => {
    const options = '--market btc-perp --side buy --type --size 1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error/],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(INVALID_ARGUMENT_TEST_NAME, async () => {
    const options = '--market btc-perp --side buy --type invalid-type --size 1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-t, --type <type>' argument 'invalid-type' is invalid\. Order type must be one of: m, market, l, limit, sm, stop-market, sl, stop-limit, ts, trailing-stop, tpm, take-profit-market, tpl, take-profit-limit\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});

describe('Option: Size', () => {
  test(SHORT_FLAG_TEST_NAME, async () => {
    const options = '--market btc-perp --side buy --type market -s 1';

    await expectPlaceSingleOrder(options);
  });

  test('SUCCEEDS: Shorthand arguments', async () => {
    const shorthands = ['k', 'm'];

    const expectations = shorthands.map((shorthand) => {
      const options = `--market btc-perp --side buy --type market --size 1${shorthand}`;

      return expectPlaceSingleOrder(options);
    });

    await Promise.all(expectations);
  });

  test(MISSING_OPTION_TEST_NAME, async () => {
    const options = '--market btc-perp --side buy --type market';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error: required option '-s, --size <size>' not specified/],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(MISSING_ARGUMENT_TEST_NAME, async () => {
    const options = '--market btc-perp --side buy --type market --size';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error/],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (NaN)`, async () => {
    const options =
      '--market btc-perp --side buy --type market --size invalid-size';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-s, --size <size>' argument 'invalid-size' is invalid\. Size must be a number greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (negative)`, async () => {
    const options = '--market btc-perp --side buy --type market --size -1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-s, --size <size>' argument '-1' is invalid\. Size must be a number greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (zero)`, async () => {
    const options = '--market btc-perp --side buy --type market --size 0';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-s, --size <size>' argument '0' is invalid\. Size must be a number greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (negative zero)`, async () => {
    const options = '--market btc-perp --side buy --type market --size -0';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-s, --size <size>' argument '-0' is invalid\. Size must be a number greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (shorthand zero)`, async () => {
    const options = '--market btc-perp --side buy --type market --size 0k';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-s, --size <size>' argument '0k' is invalid\. Size must be a number greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});
