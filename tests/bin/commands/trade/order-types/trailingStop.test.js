import { expectChildToMatch, spawnTestChild } from '../../../helpers/index.js';

import {
  composeTradeCommand,
  expectToPlaceOrders,
  expectToPlaceSplitOrder,
  expectToPlaceTwapOrder,
} from '../helpers/index.js';

const BASE_OPTIONS =
  '--market btc-perp --side buy --type trailing-stop --size 1 --trail-value 10';

describe('[ORDER TYPE] Trailing stop', () => {
  test('SUCCEEDS: Base trailing stop order', async () => {
    await expectToPlaceOrders(BASE_OPTIONS, 1);
  });

  test('SUCCEEDS: Type option argument alias (ts)', async () => {
    const options =
      '--market btc-perp --side buy --type ts --size 1 --trail-value 10';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Ignores price option', async () => {
    const options = `${BASE_OPTIONS} --price 10`;

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Split trailing stop order', async () => {
    await expectToPlaceSplitOrder(BASE_OPTIONS);
  });

  test('SUCCEEDS: TWAP trailing stop order', async () => {
    await expectToPlaceTwapOrder(BASE_OPTIONS);
  });

  test('FAILS: Missing trail value option', async () => {
    const options =
      '--market btc-perp --side buy --type trailing-stop --size 1';

    const command = composeTradeCommand(options);

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
