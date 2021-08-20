import {
  composeCommand,
  expectChildToMatch,
  expectToPlaceOrders,
  expectToPlaceSplitOrder,
  expectToPlaceTwapOrder,
  spawnTestChild,
} from '../helpers/index.js';

const BASE_OPTIONS =
  '--market btc-perp --side buy --type stop-market --size 1 --trigger-price 10';

describe('[ORDER TYPE] Stop market', () => {
  test('SUCCEEDS: Base stop market order', async () => {
    await expectToPlaceOrders(BASE_OPTIONS, 1);
  });

  test('SUCCEEDS: Type option argument alias (sm)', async () => {
    const options =
      '--market btc-perp --side buy --type sm --size 1 --trigger-price 10';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Ignores price option', async () => {
    const options = `${BASE_OPTIONS} --price 10`;

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Split stop market order', async () => {
    await expectToPlaceSplitOrder(BASE_OPTIONS);
  });

  test('SUCCEEDS: TWAP stop market order', async () => {
    await expectToPlaceTwapOrder(BASE_OPTIONS);
  });

  test('FAILS: Missing trigger price option', async () => {
    const options = '--market btc-perp --side buy --type stop-market --size 1';
    const command = composeCommand(options);

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
