import { composeOption } from '../../helpers/index.js';

const CONFIG = {
  ENABLE: {
    FLAGS: '--ioc',
    DESCRIPTION: 'enable Immediate-or-Cancel (IOC) mode',
  },
  DISABLE: {
    FLAGS: '--no-ioc',
    DESCRIPTION: 'disable Immediate-or-Cancel (IOC) mode',
  },
};

const IOC = {
  ENABLE: composeOption(CONFIG.ENABLE),
  DISABLE: composeOption(CONFIG.DISABLE),
};

export { IOC };
