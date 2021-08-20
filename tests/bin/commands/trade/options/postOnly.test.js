import { expectToPlaceOrders } from '../helpers/index.js';

describe('[OPTION] Post-Only', () => {
  test('SUCCEEDS: Long flag (--post-only)', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --post-only';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Negated long flag (--no-post-only)', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --no-post-only';

    await expectToPlaceOrders(options, 1);
  });
});
