import { expectChildToMatch, spawnTestChild } from '../../../helpers/index.js';

import {
  composeTradeCommand,
  expectToPlaceOrders,
  expectToPlaceScaledOrder,
  expectToPlaceSplitOrder,
  expectToPlaceTwapOrder,
} from '../helpers/index.js';

const BASE_OPTIONS =
  '--market btc-perp --side buy --type stop-limit --size 1 --price 10 --trigger-price 10';

describe('[ORDER TYPE] Stop limit', () => {
  test('SUCCEEDS: Base stop limit order', async () => {
    await expectToPlaceOrders(BASE_OPTIONS, 1);
  });

  test('SUCCEEDS: Type option argument alias (sl)', async () => {
    const options =
      '--market btc-perp --side buy --type sl --size 1 --price 10 --trigger-price 10';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Split stop limit order', async () => {
    await expectToPlaceSplitOrder(BASE_OPTIONS);
  });

  test('SUCCEEDS: Scaled stop limit order', async () => {
    const options =
      '--market btc-perp --side buy --type stop-limit --size 1 --trigger-price 10';

    await expectToPlaceScaledOrder(options);
  });

  test('SUCCEEDS: TWAP stop limit order', async () => {
    await expectToPlaceTwapOrder(BASE_OPTIONS);
  });

  test('FAILS: Missing price option', async () => {
    const options =
      '--market btc-perp --side buy --type stop-limit --size 1 --trigger-price 10';

    const command = composeTradeCommand(options);

    const expectedChild = {
      stdoutArray: [/.{24} {2}INFO {3}Processing order\(s\)/],
      stderrArray: [
        /.{24} {2}ERROR {4}Failed order: Limit orders must specify price/,
        /.{24} {2}ERROR {2}One or more orders failed to be placed/,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Missing trigger price option', async () => {
    const options =
      '--market btc-perp --side buy --type stop-limit --size 1 --price 10';

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
