import Conf from 'conf';

import { Logger } from '../common/index.js';
import { MockUserConfig } from '../mocks/user-config/index.js';
import { PACKAGE } from './package.js';

const defaults = {
  exchange: 'ftx',

  colour: true,
  updateNotifications: true,

  reduceOnly: false,
  ioc: false,
  postOnly: true,
  retry: true,
  rateLimit: {
    limitPerInterval: 6,
    intervalMilliseconds: 200,
  },
};

function composeUserConfig() {
  if (process.env.NODE_ENV === 'test-child') {
    return MockUserConfig.create(defaults);
  }

  try {
    return new Conf({
      projectName: PACKAGE.name,
      projectSuffix: '',
      defaults,
      clearInvalidConfig: true,
    });
  } catch {
    Logger.warn(
      'Could not access configuration file; reverting to default configuration. Please note that any configuration changes will not be saved.'
    );

    return MockUserConfig.create({ defaults, isMock: true });
  }
}

const USER = composeUserConfig();

export { USER };
