import { expectToPlaceOrders } from '../helpers/index.js';

describe('[OPTION] Retry', () => {
  test('SUCCEEDS: Long flag (--retry)', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --retry';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Negated long flag (--no-retry)', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --no-retry';

    await expectToPlaceOrders(options, 1);
  });
});
