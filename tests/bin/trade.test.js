import { spawn } from 'child_process';
import { createInterface } from 'readline';

const SHORT_FLAG_TEST_NAME = 'SUCCEEDS: Short flag';
const NEGATED_LONG_FLAG_TEST_NAME = 'SUCCEEDS: Negated long flag';

const TYPE_OPTION_ALIAS_ARGUMENT_TEST_NAME =
  'SUCCEEDS: Type option alias argument';

const MISSING_OPTION_TEST_NAME = 'FAILS: Missing option';
const MISSING_ARGUMENT_TEST_NAME = 'FAILS: Missing argument';
const INVALID_ARGUMENT_TEST_NAME = 'FAILS: Invalid argument';
const MISSING_PRICE_OPTION_TEST_NAME = 'FAILS: Missing price option';

const MISSING_TRIGGER_PRICE_OPTION_TEST_NAME =
  'FAILS: Missing trigger price option';

function composeCommand(options) {
  return `node ./bin/cli.js trade ${options}`;
}

function spawnTestChild(command) {
  return spawn(command, {
    shell: true,
    env: { ...process.env, NODE_ENV: 'test-child' },
  });
}

/**
 * TODO: These util assertion functions should extend Jest so we can use them
 * directly with `expect` and tighten the Jest linting rules.
 */

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

async function expectToPlaceOrders(options, count) {
  const command = composeCommand(options);

  const individualOrdersStdoutArray = Array.from({ length: count }).fill(
    /.{24} {2}INFO {5}Placed order/
  );

  const expectedChild = {
    stdoutArray: [
      /.{24} {2}INFO {3}Processing order\(s\)/,
      ...individualOrdersStdoutArray,
      /.{24} {2}INFO {3}Placed order\(s\)/,
    ],
    stderrArray: [],
    exitCode: 0,
  };

  const child = spawnTestChild(command);

  await expectChildToMatch(child, expectedChild);
}

function testSplitOption(basicOrderOptions) {
  test('SUCCEEDS: Split order', async () => {
    const options = `${basicOrderOptions} --split 2`;

    await expectToPlaceOrders(options, 2);
  });
}

function testIgnoresPriceOption(basicOrderOptions) {
  test('SUCCEEDS: Ignored price option', async () => {
    const options = `${basicOrderOptions} --price 10`;

    await expectToPlaceOrders(options, 1);
  });
}

function testShorthandNumberArguments(composeOptions) {
  test('SUCCEEDS: Shorthand number arguments', async () => {
    const shorthands = ['k', 'm'];

    const expectations = shorthands.map((shorthand) => {
      const options = composeOptions(shorthand);

      return expectToPlaceOrders(options, 1);
    });

    await Promise.all(expectations);
  });
}

describe('Order type: Market', () => {
  const BASIC_ORDER_OPTIONS =
    '--market btc-perp --side buy --type market --size 1';

  test('SUCCEEDS: Basic market order', async () => {
    await expectToPlaceOrders(BASIC_ORDER_OPTIONS, 1);
  });

  test(TYPE_OPTION_ALIAS_ARGUMENT_TEST_NAME, async () => {
    const options = '--market btc-perp --side buy --type m --size 1';

    await expectToPlaceOrders(options, 1);
  });

  testIgnoresPriceOption(BASIC_ORDER_OPTIONS);
  testSplitOption(BASIC_ORDER_OPTIONS);
});

describe('Order type: Limit', () => {
  const BASIC_ORDER_OPTIONS =
    '--market btc-perp --side buy --type limit --size 1 --price 10';

  test('SUCCEEDS: Basic limit order', async () => {
    await expectToPlaceOrders(BASIC_ORDER_OPTIONS, 1);
  });

  test(TYPE_OPTION_ALIAS_ARGUMENT_TEST_NAME, async () => {
    const options = '--market btc-perp --side buy --type l --size 1 --price 10';

    await expectToPlaceOrders(options, 1);
  });

  testSplitOption(BASIC_ORDER_OPTIONS);

  test(MISSING_PRICE_OPTION_TEST_NAME, async () => {
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
  const BASIC_ORDER_OPTIONS =
    '--market btc-perp --side buy --type stop-market --size 1 --trigger-price 10';

  test('SUCCEEDS: Basic stop market order', async () => {
    await expectToPlaceOrders(BASIC_ORDER_OPTIONS, 1);
  });

  test(TYPE_OPTION_ALIAS_ARGUMENT_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type sm --size 1 --trigger-price 10';

    await expectToPlaceOrders(options, 1);
  });

  testIgnoresPriceOption(BASIC_ORDER_OPTIONS);
  testSplitOption(BASIC_ORDER_OPTIONS);

  test(MISSING_TRIGGER_PRICE_OPTION_TEST_NAME, async () => {
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

describe('Order type: Stop limit', () => {
  const BASIC_ORDER_OPTIONS =
    '--market btc-perp --side buy --type stop-limit --size 1 --price 10 --trigger-price 10';

  test('SUCCEEDS: Basic stop limit order', async () => {
    await expectToPlaceOrders(BASIC_ORDER_OPTIONS, 1);
  });

  test(TYPE_OPTION_ALIAS_ARGUMENT_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type sl --size 1 --price 10 --trigger-price 10';

    await expectToPlaceOrders(options, 1);
  });

  testSplitOption(BASIC_ORDER_OPTIONS);

  test(MISSING_PRICE_OPTION_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type stop-limit --size 1 --trigger-price 10';

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

  test(MISSING_TRIGGER_PRICE_OPTION_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type stop-limit --size 1 --price 10';

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

describe('Order type: Trailing stop', () => {
  const BASIC_ORDER_OPTIONS =
    '--market btc-perp --side buy --type trailing-stop --size 1 --trail-value 10';

  test('SUCCEEDS: Basic trailing stop order', async () => {
    await expectToPlaceOrders(BASIC_ORDER_OPTIONS, 1);
  });

  test(TYPE_OPTION_ALIAS_ARGUMENT_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type ts --size 1 --trail-value 10';

    await expectToPlaceOrders(options, 1);
  });

  testIgnoresPriceOption(BASIC_ORDER_OPTIONS);
  testSplitOption(BASIC_ORDER_OPTIONS);

  test('FAILS: Missing trail value option', async () => {
    const options =
      '--market btc-perp --side buy --type trailing-stop --size 1';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [/.{24} {2}INFO {3}Processing order\(s\)/],
      stderrArray: [
        /.{24} {2}ERROR {4}Failed order: Trailing stop orders must specify trail value/,
        /.{24} {2}ERROR {2}One or more orders failed to be placed/,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});

describe('Order type: Take profit market', () => {
  const BASIC_ORDER_OPTIONS =
    '--market btc-perp --side buy --type take-profit-market --size 1 --trigger-price 10';

  test('SUCCEEDS: Basic take profit market order', async () => {
    await expectToPlaceOrders(BASIC_ORDER_OPTIONS, 1);
  });

  test(TYPE_OPTION_ALIAS_ARGUMENT_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type tpm --size 1 --trigger-price 10';

    await expectToPlaceOrders(options, 1);
  });

  testIgnoresPriceOption(BASIC_ORDER_OPTIONS);
  testSplitOption(BASIC_ORDER_OPTIONS);

  test(MISSING_TRIGGER_PRICE_OPTION_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type take-profit-market --size 1';

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

describe('Order type: Take profit limit', () => {
  const BASIC_ORDER_OPTIONS =
    '--market btc-perp --side buy --type take-profit-limit --size 1 --price 10 --trigger-price 10';

  test('SUCCEEDS: Basic take profit limit order', async () => {
    await expectToPlaceOrders(BASIC_ORDER_OPTIONS, 1);
  });

  test(TYPE_OPTION_ALIAS_ARGUMENT_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type tpl --size 1 --price 10 --trigger-price 10';

    await expectToPlaceOrders(options, 1);
  });

  testSplitOption(BASIC_ORDER_OPTIONS);

  test(MISSING_PRICE_OPTION_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type take-profit-limit --size 1 --trigger-price 10';

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

  test(MISSING_TRIGGER_PRICE_OPTION_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type take-profit-limit --size 1 --price 10';

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

    await expectToPlaceOrders(options, 1);
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

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Alias arguments', async () => {
    const aliases = ['b', 's'];

    const expectations = aliases.map((alias) => {
      const options = `--market btc-perp --side ${alias} --type market --size 1`;

      return expectToPlaceOrders(options, 1);
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

    await expectToPlaceOrders(options, 1);
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

    await expectToPlaceOrders(options, 1);
  });

  testShorthandNumberArguments(
    (shorthand) =>
      `--market btc-perp --side buy --type market --size 1${shorthand}`
  );

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

describe('Option: Price', () => {
  test(SHORT_FLAG_TEST_NAME, async () => {
    const options = '--market btc-perp --side buy --type limit --size 1 -p 10';

    await expectToPlaceOrders(options, 1);
  });

  testShorthandNumberArguments(
    (shorthand) =>
      `--market btc-perp --side buy --type limit --size 1 --price 1${shorthand}`
  );

  test('SUCCEEDS: Price range', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 10:20';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Reverse price range', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 20:10';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Shorthand price range', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 10k:20k';

    await expectToPlaceOrders(options, 1);
  });

  test(MISSING_ARGUMENT_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price';

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
      '--market btc-perp --side buy --type limit --size 1 --price invalid-price';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument 'invalid-price' is invalid\. Price must be a number, or range of numbers, greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (negative)`, async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price -1';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '-1' is invalid\. Price must be a number, or range of numbers, greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (zero)`, async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 0';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '0' is invalid\. Price must be a number, or range of numbers, greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (negative zero)`, async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price -0';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '-0' is invalid\. Price must be a number, or range of numbers, greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (shorthand zero)`, async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 0k';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '0k' is invalid\. Price must be a number, or range of numbers, greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (price range missing first price)`, async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price :10';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument ':10' is invalid\. Price must be a number, or range of numbers, greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (price range missing second price)`, async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 10:';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '10:' is invalid\. Price must be a number, or range of numbers, greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (price range extra price)`, async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 10:20:30';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '10:20:30' is invalid\. Price must be a number, or range of numbers, greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (price range invalid prices)`, async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price invalid-price:invalid-price';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument 'invalid-price:invalid-price' is invalid\. Price must be a number, or range of numbers, greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});

describe('Option: Trigger price', () => {
  testShorthandNumberArguments(
    (shorthand) =>
      `--market btc-perp --side buy --type market --size 1 --trigger-price 1${shorthand}`
  );

  test(MISSING_ARGUMENT_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --trigger-price';

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
      '--market btc-perp --side buy --type market --size 1 --trigger-price invalid-trigger-price';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '--trigger-price <price>' argument 'invalid-trigger-price' is invalid\. Trigger price must be a number greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (negative)`, async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --trigger-price -1';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '--trigger-price <price>' argument '-1' is invalid\. Trigger price must be a number greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (zero)`, async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --trigger-price 0';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '--trigger-price <price>' argument '0' is invalid\. Trigger price must be a number greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (negative zero)`, async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --trigger-price -0';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '--trigger-price <price>' argument '-0' is invalid\. Trigger price must be a number greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test(`${INVALID_ARGUMENT_TEST_NAME} (shorthand zero)`, async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --trigger-price 0k';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '--trigger-price <price>' argument '0k' is invalid\. Trigger price must be a number greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});

describe('Option: Reduce-Only', () => {
  test(NEGATED_LONG_FLAG_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --no-reduce-only';

    await expectToPlaceOrders(options, 1);
  });
});

describe('Option: IOC', () => {
  test(NEGATED_LONG_FLAG_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --no-ioc';

    await expectToPlaceOrders(options, 1);
  });
});

describe('Option: Post-Only', () => {
  test(NEGATED_LONG_FLAG_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --no-post-only';

    await expectToPlaceOrders(options, 1);
  });
});

describe('Option: Retry-Until-Filled', () => {
  test(NEGATED_LONG_FLAG_TEST_NAME, async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --no-retry';

    await expectToPlaceOrders(options, 1);
  });
});
