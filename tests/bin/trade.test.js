import { spawn } from 'child_process';

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
  let stdoutIndex = 0;
  let stderrIndex = 0;

  child.stdout.on('data', (data) => {
    expect(data.toString()).toMatch(expectedChild.stdoutArray[stdoutIndex]);
    stdoutIndex += 1;
  });

  child.stderr.on('data', (data) => {
    expect(data.toString()).toMatch(expectedChild.stderrArray[stderrIndex]);
    stderrIndex += 1;
  });

  return new Promise((resolve) => {
    child.on('close', (exitCode) => {
      // Expect the expected output arrays to be exhausted.
      expect(stdoutIndex).toBe(expectedChild.stdoutArray.length);
      expect(stderrIndex).toBe(expectedChild.stderrArray.length);

      expect(exitCode).toBe(expectedChild.exitCode);
      resolve();
    });
  });
}

async function expectPlaceSingleOrder(options) {
  const command = composeCommand(options);

  const expectedChild = {
    stdoutArray: [
      /.{24} {2}INFO {3}Processing order\(s\)\n/,
      /.{24} {2}INFO {5}Placed order\n/,
      /.{24} {2}INFO {3}Placed order\(s\)\n/,
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

  test('SUCCEEDS: Type option alias argument', async () => {
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

  test('SUCCEEDS: Type option alias argument', async () => {
    const options = '--market btc-perp --side buy --type l --size 1 --price 10';

    await expectPlaceSingleOrder(options);
  });

  test('FAILS: Missing price option', async () => {
    const options = '--market btc-perp --side buy --type limit --size 1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [/.{24} {2}INFO {3}Processing order\(s\)\n/],
      stderrArray: [
        /.{24} {2}ERROR {4}Failed order: Limit orders must specify price\n/,
        /.{24} {2}ERROR {2}One or more orders failed to be placed\n/,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});

describe('Option: Market', () => {
  test('SUCCEEDS: Short flag', async () => {
    const options = '-m btc-perp --side buy --type market --size 1';

    await expectPlaceSingleOrder(options);
  });

  test('FAILS: Missing option', async () => {
    const options = '--side buy --type market --size 1 --price 10';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: required option '-m, --market <market>' not specified\n/,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Missing argument', async () => {
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
      stdoutArray: [/.{24} {2}INFO {3}Processing order\(s\)\n/],
      stderrArray: [
        /.{24} {2}ERROR {4}Failed order: No such market: INVALID-MARKET\n/,
        /.{24} {2}ERROR {2}One or more orders failed to be placed\n/,
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

  test('FAILS: Missing option', async () => {
    const options = '--market btc-perp --type market --size 1 --price 10';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error: required option '--side <side>' not specified\n/],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Missing argument', async () => {
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

  test('FAILS: Invalid argument', async () => {
    const options =
      '--market btc-perp --side invalid-side --type market --size 1';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '--side <side>' argument 'invalid-side' is invalid\. Side must be one of: b, buy, s, sell\.\n/,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});
