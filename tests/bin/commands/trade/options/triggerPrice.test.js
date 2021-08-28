import { expectChildToMatch, spawnTestChild } from '../../../helpers/index.js';

import {
  composeTradeCommand,
  expectToAcceptNumberShorthandArguments,
  expectToPlaceOrders,
} from '../helpers/index.js';

describe('[OPTION] Trigger price', () => {
  test('SUCCEEDS: Long flag (--trigger-price)', async () => {
    const options =
      '--market btc-perp --side buy --type stop-market --size 1 --trigger-price 10';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Number shorthand arguments', async () => {
    await expectToAcceptNumberShorthandArguments(
      (shorthand) =>
        `--market btc-perp --side buy --type stop-market --size 1 --trigger-price 1${shorthand}`
    );
  });

  test('FAILS: Missing argument', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --trigger-price';

    const command = composeTradeCommand(options);

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
      '--market btc-perp --side buy --type market --size 1 --trigger-price invalid-trigger-price';

    const command = composeTradeCommand(options);

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

  test('FAILS: Invalid argument (negative)', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --trigger-price -1';

    const command = composeTradeCommand(options);

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

  test('FAILS: Invalid argument (zero)', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --trigger-price 0';

    const command = composeTradeCommand(options);

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

  test('FAILS: Invalid argument (negative zero)', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --trigger-price -0';

    const command = composeTradeCommand(options);

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

  test('FAILS: Invalid argument (shorthand zero)', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --trigger-price 0k';

    const command = composeTradeCommand(options);

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
