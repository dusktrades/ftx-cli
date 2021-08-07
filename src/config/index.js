import Conf from 'conf';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const PACKAGE = require('../../package.json');

const USER = new Conf({
  projectName: PACKAGE.name,
  projectSuffix: '',
  defaults: {
    EXCHANGE: 'ftx',
    ENABLE_COLOURS: true,
    ENABLE_IOC: false,
    ENABLE_POST_ONLY: true,
    ENABLE_REDUCE_ONLY: false,
    ENABLE_RETRY: true,
    ORDER_RATE_LIMIT_INTERVAL_MS: 200,
    ORDER_RATE_LIMIT_INTERVAL_QUOTA: 6,
  },
});

const CONFIG = {
  PACKAGE,
  USER,
  EXTERNAL_REFERRAL_PROGRAM_NAME: 'FTX CLI',
};

export { CONFIG };
