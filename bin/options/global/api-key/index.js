import { composeOption } from '../../helpers/index.js';

const CONFIG = {
  FLAGS: '-k, --key <key>',
  DESCRIPTION: 'FTX API key',
};

const API_KEY = composeOption(CONFIG);

export { API_KEY };
