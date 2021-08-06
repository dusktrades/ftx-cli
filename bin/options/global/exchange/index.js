import { composeOption } from '../../helpers/index.js';

const CONFIG = {
  FLAGS: '-e, --exchange <exchange>',
  DESCRIPTION: 'FTX exchange platform',
  CHOICES: ['ftx', 'ftx-us'],
};

const EXCHANGE = composeOption(CONFIG);

export { EXCHANGE };
