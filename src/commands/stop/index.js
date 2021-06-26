import { Ftx } from '../../api/index.js';
import { Logger } from '../../common/index.js';
import { offers } from '../offers/index.js';

async function run(options) {
  const credentials = {
    apiKey: options.global.key,
    apiSecret: options.global.secret,
    subaccount: options.global.subaccount,
  };

  await Ftx.lendingOffers.stop({
    exchange: options.global.exchange,
    credentials,
    filters: { currencies: options.command.currency },
  });

  Logger.info('Withdrew lending offer(s)', {
    enableColours: options.global.enableColours,
  });

  // Show updated offer list.
  await offers.run(options);
}

const stop = { run };

export { stop };
