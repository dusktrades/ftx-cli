import { expectToPlaceOrders } from '../helpers/index.js';

describe('[OPTION] Reduce-Only', () => {
  test('SUCCEEDS: Long flag (--reduce-only)', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --reduce-only';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Negated long flag (--no-reduce-only)', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --no-reduce-only';

    await expectToPlaceOrders(options, 1);
  });
});
