import {
  expectToPlaceOrders,
  expectToPlaceSplitOrder,
  expectToPlaceTwapOrder,
} from '../helpers/index.js';

const BASE_OPTIONS = '--market btc-perp --side buy --type market --size 1';

describe('[ORDER TYPE] Market', () => {
  test('SUCCEEDS: Base market order', async () => {
    await expectToPlaceOrders(BASE_OPTIONS, 1);
  });

  test('SUCCEEDS: Type option argument alias (m)', async () => {
    const options = '--market btc-perp --side buy --type m --size 1';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Ignores price option', async () => {
    const options = `${BASE_OPTIONS} --price 10`;

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Split market order', async () => {
    await expectToPlaceSplitOrder(BASE_OPTIONS);
  });

  test('SUCCEEDS: TWAP market order', async () => {
    await expectToPlaceTwapOrder(BASE_OPTIONS);
  });
});
