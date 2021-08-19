import Conf from 'conf';

import { MockUserConfig } from '../mocks/user-config/index.js';
import { PACKAGE } from './package.js';

const DEFAULTS = {
  EXCHANGE: 'ftx',
  ENABLE_REDUCE_ONLY: false,
  ENABLE_IOC: false,
  ENABLE_POST_ONLY: true,
  ENABLE_RETRY: true,
  RATE_LIMIT: {
    intervalLimit: 6,
    intervalMs: 200,
  },
  ENABLE_COLOURS: true,
};

function composeUserConfig() {
  if (process.env.NODE_ENV === 'test-child') {
    return MockUserConfig.create(DEFAULTS);
  }

  return new Conf({
    projectName: PACKAGE.name,
    projectSuffix: '',
    defaults: DEFAULTS,
  });
}

const USER = composeUserConfig();

export { USER };
