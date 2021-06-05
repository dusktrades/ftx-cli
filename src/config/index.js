import Conf from 'conf';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const PACKAGE = require('../../package.json');

const USER = new Conf({
  projectName: PACKAGE.name,
  projectSuffix: '',
  defaults: {
    EXCHANGE: 'ftx',
  },
});

const CONFIG = {
  PACKAGE,
  USER,
};

export { CONFIG };
