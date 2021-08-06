import { composeOption } from '../../helpers/index.js';

const CONFIG = {
  FLAGS: '-a, --subaccount <subaccount>',
  DESCRIPTION: 'FTX subaccount name',
};

const SUBACCOUNT = composeOption(CONFIG);

export { SUBACCOUNT };
