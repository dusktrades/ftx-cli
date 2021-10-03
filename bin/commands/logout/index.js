import { run } from './run.js';

const LOGOUT = {
  name: 'logout',
  description: 'Remove local FTX API credentials and subaccount.',
  run,
};

export { LOGOUT };
