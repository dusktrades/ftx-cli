import { expectChildToMatch, spawnTestChild } from '../../../helpers/index.js';

import {
  composeTradeCommand,
  expectToPlaceOrders,
  expectToPlaceSplitOrder,
  expectToPlaceTwapOrder,
} from '../helpers/index.js';

const BASE_OPTIONS =
  '--market btc-perp --side buy --type take-profit-market --size 1 --trigger-price 10';

describe('[ORDER TYPE] Take profit market', () => {
  test('SUCCEEDS: Base take profit market order', async () => {
    await expectToPlaceOrders(BASE_OPTIONS, 1);
  });

  test('SUCCEEDS: Type option argument alias (tpm)', async () => {
    const options =
      '--market btc-perp --side buy --type tpm --size 1 --trigger-price 10';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Ignores price option', async () => {
    const options = `${BASE_OPTIONS} --price 10`;

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Split take profit market order', async () => {
    await expectToPlaceSplitOrder(BASE_OPTIONS);
  });

  test('SUCCEEDS: TWAP take profit market order', async () => {
    await expectToPlaceTwapOrder(BASE_OPTIONS);
  });

  test('FAILS: Missing trigger price option', async () => {
    const options =
      '--market btc-perp --side buy --type take-profit-market --size 1';

    const command = composeTradeCommand(options);

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
