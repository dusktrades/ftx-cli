import { Logger } from '../../common/index.js';

async function run(options) {
  Logger.info('Placed order(s)', {
    enableColours: options.global.enableColours,
  });
}

const trade = { run };

export { trade };
