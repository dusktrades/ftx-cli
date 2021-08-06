import { composeOption } from '../../helpers/index.js';

const CONFIG = {
  FLAGS: '-x, --secret <secret>',
  DESCRIPTION: 'FTX API secret',
};

const API_SECRET = composeOption(CONFIG);

export { API_SECRET };
