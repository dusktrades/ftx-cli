import { Ftx } from '../../../src/api/index.js';
import { Logger } from '../../../src/common/index.js';

async function run(options) {
  const credentials = {
    apiKey: options.key,
    apiSecret: options.secret,
    subaccount: options.subaccount,
  };

  Logger.info('Cancelling order(s)');

  await Ftx.orders.cancel({
    exchange: options.exchange,
    credentials,
    filters: {
      market: options.market,
      side: options.side,
    },
  });

  Logger.info('Queued order cancellation(s)');
}

export { run };
