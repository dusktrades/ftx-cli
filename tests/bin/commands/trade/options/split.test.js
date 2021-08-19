import {
  composeCommand,
  expectChildToMatch,
  expectToAcceptShorthandNumberArguments,
  expectToPlaceOrders,
  spawnTestChild,
} from '../helpers/index.js';

// Method of testing shorthand number arguments while only placing one order.
const MOCK_SHORTHAND_NUMBER_ARGUMENTS = {
  k: '0.001k',
  m: '0.000001m',
};

async function expectArgumentToBeInvalid(argument) {
  const options = `--market btc-perp --side buy --type market --size 1 --split ${argument}`;

  const command = composeCommand(options);

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

  test('SUCCEEDS: Shorthand number arguments', async () => {
    await expectToAcceptShorthandNumberArguments((shorthand) => {
      const argument = MOCK_SHORTHAND_NUMBER_ARGUMENTS[shorthand];

      return `--market btc-perp --side buy --type market --size 1 --split ${argument}`;
    });
  });

  test('FAILS: Missing argument', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --split';

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
