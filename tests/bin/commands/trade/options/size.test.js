import {
  composeCommand,
  expectChildToMatch,
  expectToAcceptShorthandNumberArguments,
  expectToPlaceOrders,
  spawnTestChild,
} from '../helpers/index.js';

describe('[OPTION] Size', () => {
  test('SUCCESS: Long flag (--size)', async () => {
    const options = '--market btc-perp --side buy --type market --size 1';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCESS: Short flag (-s)', async () => {
    const options = '--market btc-perp --side buy --type market -s 1';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCESS: Shorthand number arguments', async () => {
    await expectToAcceptShorthandNumberArguments(
      (shorthand) =>
        `--market btc-perp --side buy --type market --size 1${shorthand}`
    );
  });

  test('FAILS: Missing required option', async () => {
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

  test('FAILS: Missing argument', async () => {
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

  test('FAILS: Invalid argument (NaN)', async () => {
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

  test('FAILS: Invalid argument (negative)', async () => {
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

  test('FAILS: Invalid argument (zero)', async () => {
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

  test('FAILS: Invalid argument (negative zero)', async () => {
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

  test('FAILS: Invalid argument (shorthand zero)', async () => {
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
