import { composeOption } from '../../helpers/index.js';

const CONFIG = {
  ENABLE: {
    FLAGS: '--colour',
    DESCRIPTION: 'enable coloured output',
  },
  DISABLE: {
    FLAGS: '--no-colour',
    DESCRIPTION: 'disable coloured output',
  },
};

const COLOUR = {
  ENABLE: composeOption(CONFIG.ENABLE),
  DISABLE: composeOption(CONFIG.DISABLE),
};

export { COLOUR };
