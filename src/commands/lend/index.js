import { Ftx } from '../../api/index.js';
import { Logger } from '../../common/index.js';
import { offers } from '../offers/index.js';

async function run(options) {
  // TODO: Move branching like this to derived API controllers.
  const { error } =
    options.command.currency == null
      ? await Ftx.lendingOffers.createAll(options)
      : await Ftx.lendingOffers.create(options);

  if (error != null) {
    Logger.error(error);

    return;
  }

  Logger.info('Created lending offer(s)');

  // Show updated offer list.
  await offers.run(options);
}

const lend = { run };

export { lend };
