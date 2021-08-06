import { composeOption } from '../../helpers/index.js';

const CONFIG = {
  ENABLE: {
    FLAGS: '--retry',
    DESCRIPTION: 'enable Retry-Until-Filled mode',
  },
  DISABLE: {
    FLAGS: '--no-retry',
    DESCRIPTION: 'disable Retry-Until-Filled mode',
  },
};

const RETRY = {
  ENABLE: composeOption(CONFIG.ENABLE),
  DISABLE: composeOption(CONFIG.DISABLE),
};

export { RETRY };
