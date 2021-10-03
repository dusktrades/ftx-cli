import { Ftx } from '../../../src/api/index.js';
import { Logger } from '../../../src/common/index.js';

async function run(options) {
  const credentials = {
    apiKey: options.key,
    apiSecret: options.secret,
    subaccount: options.subaccount,
  };

  await Ftx.lendingOffers.stop({
    exchange: options.exchange,
    credentials,
    filters: { currencies: options.currency },
  });

  Logger.info('Withdrew lending offer(s)');
}

export { run };
