import { expectChildToMatch, spawnTestChild } from '../../../helpers/index.js';
import { composeTradeCommand, expectToPlaceOrders } from '../helpers/index.js';

const argumentChoices = ['base', 'b', 'quote', 'q'];
const baseOptions = '--market btc/usd --side buy --type market --size 1';

describe('[OPTION] Size currency', () => {
  describe('SUCCEEDS: Long flag (--size-currency); valid argument choice', () => {
    for (const argumentChoice of argumentChoices) {
      test(`SUCCEEDS: --size-currency ${argumentChoice}`, async () => {
        const options = `${baseOptions} --size-currency ${argumentChoice}`;

        return expectToPlaceOrders(options, 1);
      });
    }
  });

  test('FAILS: Missing argument', async () => {
    const options = `${baseOptions} --size-currency`;

    const command = composeTradeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error/],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument choice', async () => {
    const options = `${baseOptions} --size-currency invalid-argument`;

    const command = composeTradeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '--size-currency <source>' argument 'invalid-argument' is invalid\. Size currency must be one of: base, b, quote, q\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});
