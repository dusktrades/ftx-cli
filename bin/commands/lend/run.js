import { Ftx } from '../../../src/api/index.js';
import { Logger } from '../../../src/common/index.js';

async function run(options) {
  const credentials = {
    apiKey: options.key,
    apiSecret: options.secret,
    subaccount: options.subaccount,
  };

  const data = {
    size: options.size,
    minRate: options.minRate,
  };

  await Ftx.lendingOffers.create({
    exchange: options.exchange,
    credentials,
    data,
    filters: { currencies: options.currency },
  });

  Logger.info('Created lending offer(s)');
}

export { run };
