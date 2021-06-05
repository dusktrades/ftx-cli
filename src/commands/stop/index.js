import { Ftx } from '../../api/index.js';
import { Logger } from '../../common/index.js';
import { offers } from '../offers/index.js';

async function run(options) {
  const { error } =
    options.command.currency == null
      ? await Ftx.lendingOffers.stopAll(options)
      : await Ftx.lendingOffers.stop(options);

  if (error != null) {
    Logger.error(error);

    return;
  }

  Logger.info('Withdrew lending offer(s)');

  // Show updated offer list.
  await offers.run(options);
}

const stop = { run };

export { stop };
