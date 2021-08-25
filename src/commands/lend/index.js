import { Ftx } from '../../api/index.js';
import { Logger } from '../../common/index.js';
import { offers } from '../offers/index.js';

async function run(options) {
  const credentials = {
    apiKey: options.global.key,
    apiSecret: options.global.secret,
    subaccount: options.global.subaccount,
  };

  const data = {
    size: options.command.size,
    minRate: options.command.minRate,
  };

  await Ftx.lendingOffers.create({
    exchange: options.global.exchange,
    credentials,
    data,
    filters: { currencies: options.command.currency },
  });

  Logger.info('Created lending offer(s)');

  // Show updated offer list.
  await offers.run(options);
}

const lend = { run };

export { lend };
