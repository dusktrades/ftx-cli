import { composeOption } from '../../helpers/index.js';

const CONFIG = {
  ENABLE: {
    FLAGS: '--reduce-only',
    DESCRIPTION: 'enable Reduce-Only mode',
  },
  DISABLE: {
    FLAGS: '--no-reduce-only',
    DESCRIPTION: 'disable Reduce-Only mode',
  },
};

const REDUCE_ONLY = {
  ENABLE: composeOption(CONFIG.ENABLE),
  DISABLE: composeOption(CONFIG.DISABLE),
};

export { REDUCE_ONLY };
