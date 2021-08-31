import { expectChildToMatch, spawnTestChild } from '../../../helpers/index.js';

import {
  composeTradeCommand,
  expectToAcceptNumberShorthandArguments,
  expectToPlaceOrders,
} from '../helpers/index.js';

async function expectArgumentToBeInvalid(argument) {
  const options = `--market btc-perp --side buy --type trailing-stop --size 1 --trail-value ${argument}`;
  const command = composeTradeCommand(options);

  const expectedChild = {
    stdoutArray: [],
    stderrArray: [
      new RegExp(
        String.raw`error: option '--trail-value <value>' argument '${argument}' is invalid\. Trail value must be a non-zero number\.`
      ),
    ],
    exitCode: 1,
  };

  const child = spawnTestChild(command);

  await expectChildToMatch(child, expectedChild);
}

describe('[OPTION] Trail value', () => {
  test('SUCCEEDS: Long flag (--trail-value)', async () => {
    const options =
      '--market btc-perp --side buy --type trailing-stop --size 1 --trail-value 10';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Negative argument', async () => {
    const options =
      '--market btc-perp --side sell --type trailing-stop --size 1 --trail-value -10';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Number shorthand arguments', async () => {
    await expectToAcceptNumberShorthandArguments(
      (shorthand) =>
        `--market btc-perp --side buy --type trailing-stop --size 1 --trail-value 10${shorthand}`
    );
  });

  test('SUCCEEDS: Negative number shorthand argument', async () => {
    const options =
      '--market btc-perp --side sell --type trailing-stop --size 1 --trail-value -10k';

    await expectToPlaceOrders(options, 1);
  });

  test('FAILS: Missing argument', async () => {
    const options =
      '--market btc-perp --side buy --type trailing-stop --size 1 --trail-value';

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
    await expectArgumentToBeInvalid('invalid-trail-value');
  });

  test('FAILS: Invalid argument (zero)', async () => {
    await expectArgumentToBeInvalid('0');
  });

  test('FAILS: Invalid argument (negative zero)', async () => {
    await expectArgumentToBeInvalid('-0');
  });

  test('FAILS: Invalid argument (shorthand zero)', async () => {
    await expectArgumentToBeInvalid('0k');
  });
});
