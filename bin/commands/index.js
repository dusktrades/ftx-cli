import { CONFIG } from './config/index.js';
import { EARNINGS } from './earnings/index.js';
import { FUTURES } from './futures/index.js';
import { LEND } from './lend/index.js';
import { LOGIN } from './login/index.js';
import { LOGOUT } from './logout/index.js';
import { OFFERS } from './offers/index.js';
import { RATES } from './rates/index.js';
import { SPOT } from './spot/index.js';
import { STOP } from './stop/index.js';
import { TRADE } from './trade/index.js';
import { composeCommand } from './composeCommand.js';

/**
 * The order here is the order commands will appear in help outputs. Commands
 * are grouped and then sorted by authentication and action type.
 */
const COMMANDS = [
  // Exchange/account commands.
  LOGIN,
  LOGOUT,

  // Configuration commands.
  CONFIG,

  // Market commands.
  SPOT,
  FUTURES,

  // Trading commands.
  TRADE,

  // Lending commands.
  RATES,
  OFFERS,
  EARNINGS,
  LEND,
  STOP,
];

export { COMMANDS, composeCommand };
