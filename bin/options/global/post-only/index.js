import { composeOption } from '../../helpers/index.js';

const CONFIG = {
  ENABLE: {
    FLAGS: '--post-only',
    DESCRIPTION: 'enable Post-Only mode',
  },
  DISABLE: {
    FLAGS: '--no-post-only',
    DESCRIPTION: 'disable Post-Only mode',
  },
};

const POST_ONLY = {
  ENABLE: composeOption(CONFIG.ENABLE),
  DISABLE: composeOption(CONFIG.DISABLE),
};

export { POST_ONLY };
