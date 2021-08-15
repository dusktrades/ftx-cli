import { spawn } from 'child_process';
import nock from 'nock';

beforeAll(() => {
  expect(process.env.NODE_ENV).toBe('test');
  expect(nock.isActive()).toBe(true);
});

function composeCommand(options) {
  return `node ./bin/cli.js trade ${options}`;
}

// Matches a child process' ordered stdout, stderr, and exit code.
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
      // Expect the output arrays to be exhausted.
      expect(stdoutIndex).toBe(expectedChild.stdoutArray.length);
      expect(stderrIndex).toBe(expectedChild.stderrArray.length);

      expect(exitCode).toBe(expectedChild.exitCode);
      resolve();
    });
  });
}

test('SUCCEEDS: Market order with required options.', async () => {
  const command = composeCommand(
    '--market btc-perp --side buy --type market --size 1'
  );

  const expectedChild = {
    stdoutArray: [
      /.{24} {2}INFO {3}Processing order\(s\)\n/,
      /.{24} {2}INFO {5}Placed order\n/,
      /.{24} {2}INFO {3}Placed order\(s\)\n/,
    ],
    stderrArray: [],
    exitCode: 0,
  };

  const child = spawn(command, { shell: true });

  await expectChildToMatch(child, expectedChild);
});

test('SUCCEEDS: Limit order with required options.', async () => {
  const command = composeCommand(
    '--market btc-perp --side buy --type limit --size 1 --price 10'
  );

  const expectedChild = {
    stdoutArray: [
      /.{24} {2}INFO {3}Processing order\(s\)\n/,
      /.{24} {2}INFO {5}Placed order\n/,
      /.{24} {2}INFO {3}Placed order\(s\)\n/,
    ],
    stderrArray: [],
    exitCode: 0,
  };

  const child = spawn(command, { shell: true });

  await expectChildToMatch(child, expectedChild);
});

describe('Option: `-m, --market <market>`', () => {
  test('FAILS: Missing option.', async () => {
    const command = composeCommand('--side buy --type market --size 1');

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: required option '-m, --market <market>' not specified\n/,
      ],
      exitCode: 1,
    };

    const child = spawn(command, { shell: true });

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Missing option argument.', async () => {
    const command = composeCommand(
      '--market --side buy --type market --size 1'
    );

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error: required option '--side <side>' not specified\n/],
      exitCode: 1,
    };

    const child = spawn(command, { shell: true });

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid option argument.', async () => {
    const command = composeCommand(
      '--market invalid-market --side buy --type market --size 1'
    );

    const expectedChild = {
      stdoutArray: [/.{24} {2}INFO {3}Processing order\(s\)\n/],
      stderrArray: [
        /.{24} {2}ERROR {4}Failed order: No such market: INVALID-MARKET\n/,
        /.{24} {2}ERROR {2}One or more orders failed to be placed\n/,
      ],
      exitCode: 1,
    };

    const child = spawn(command, { shell: true });

    await expectChildToMatch(child, expectedChild);
  });
});
