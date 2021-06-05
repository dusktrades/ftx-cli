import { config } from './config/index.js';
import { earnings } from './earnings/index.js';
import { lend } from './lend/index.js';
import { login } from './login/index.js';
import { logout } from './logout/index.js';
import { offers } from './offers/index.js';
import { rates } from './rates/index.js';
import { stop } from './stop/index.js';

const Commands = {
  config,
  earnings,
  lend,
  login,
  logout,
  offers,
  rates,
  stop,
};

export { Commands };
