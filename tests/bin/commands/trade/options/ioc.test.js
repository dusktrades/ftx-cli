import { expectToPlaceOrders } from '../helpers/index.js';

describe('[OPTION] IOC', () => {
  test('SUCCESS: Long flag (--ioc)', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --ioc --no-post-only';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCESS: Negated long flag (--no-ioc)', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --no-ioc --no-post-only';

    await expectToPlaceOrders(options, 1);
  });
});
