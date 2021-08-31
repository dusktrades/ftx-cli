import { expectChildToMatch, spawnTestChild } from '../../../helpers/index.js';

import {
  composeTradeCommand,
  expectToAcceptNumberShorthandArguments,
  expectToPlaceOrders,
} from '../helpers/index.js';

// Method of testing number shorthand arguments while only placing one order.
const MOCK_NUMBER_SHORTHAND_ARGUMENTS = {
  k: '0.001k',
  K: '0.001K',
  m: '0.000001m',
  M: '0.000001M',
};

async function expectArgumentToBeInvalid(argument) {
  const options = `--market btc-perp --side buy --type market --size 1 --split ${argument}`;

  const command = composeTradeCommand(options);

  const expectedChild = {
    stdoutArray: [],
    stderrArray: [
      new RegExp(
        String.raw`error: option '--split <count>' argument '${argument}' is invalid\. Split must be an integer greater than zero\.`
      ),
    ],
    exitCode: 1,
  };

  const child = spawnTestChild(command);

  await expectChildToMatch(child, expectedChild);
}

describe('[OPTION] Split', () => {
  test('SUCCEEDS: Long flag (--split)', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --split 1';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Number shorthand arguments', async () => {
    await expectToAcceptNumberShorthandArguments((shorthand) => {
      const argument = MOCK_NUMBER_SHORTHAND_ARGUMENTS[shorthand];

      return `--market btc-perp --side buy --type market --size 1 --split ${argument}`;
    });
  });

  test('FAILS: Missing argument', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --split';

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

  test('FAILS: Invalid argument (float)', async () => {
    await expectArgumentToBeInvalid('0.1');
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
