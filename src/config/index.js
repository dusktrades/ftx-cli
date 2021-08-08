import Conf from 'conf';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const PACKAGE = require('../../package.json');

const USER = new Conf({
  projectName: PACKAGE.name,
  projectSuffix: '',
  defaults: {
    EXCHANGE: 'ftx',
    ENABLE_IOC: false,
    ENABLE_POST_ONLY: true,
    ENABLE_REDUCE_ONLY: false,
    ENABLE_RETRY: true,
    RATE_LIMIT: {
      intervalLimit: 6,
      intervalMs: 200,
    },
    ENABLE_COLOURS: true,
  },
});

const CONFIG = {
  PACKAGE,
  USER,
  EXTERNAL_REFERRAL_PROGRAM_NAME: 'FTX CLI',
};

export { CONFIG };
