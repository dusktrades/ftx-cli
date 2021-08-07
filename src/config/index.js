import Conf from 'conf';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const PACKAGE = require('../../package.json');

const USER = new Conf({
  projectName: PACKAGE.name,
  projectSuffix: '',
  defaults: {
    ENABLE_COLOURS: true,
    ENABLE_IOC: false,
    ENABLE_POST_ONLY: true,
    ENABLE_REDUCE_ONLY: false,
    EXCHANGE: 'ftx',
  },
});

const CONFIG = {
  PACKAGE,
  USER,
  EXTERNAL_REFERRAL_PROGRAM_NAME: 'FTX CLI',
};

export { CONFIG };
